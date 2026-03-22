"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl as presignPutObject } from "@aws-sdk/s3-request-presigner";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

const SIGNED_URL_TTL_SECONDS = 3600;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

function assertValidFileHash(fileHash: string): void {
  if (!/^[a-f0-9]{64}$/i.test(fileHash)) {
    throw new Error("Invalid file hash: expected 64-character hex SHA-256");
  }
}

function assertValidContentType(contentType: string): void {
  const normalized = contentType.trim().toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.has(normalized)) {
    throw new Error(
      `Unsupported content type. Allowed: ${[...ALLOWED_IMAGE_TYPES].join(", ")}`,
    );
  }
}

/** Object key under the bucket; must be a safe relative path (no traversal). */
function assertValidObjectKey(key: string): void {
  const trimmed = key.trim();
  if (!trimmed || trimmed.length > 512) {
    throw new Error("Invalid object key");
  }
  if (trimmed.startsWith("/") || trimmed.includes("..")) {
    throw new Error("Invalid object key: path traversal not allowed");
  }
}

function joinPublicUrl(base: string, key: string): string {
  return `${base.replace(/\/+$/, "")}/${key.replace(/^\/+/, "")}`;
}

function getR2Config(): {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicBaseUrl: string;
} {
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName || !publicBaseUrl) {
    throw new Error("Missing Cloudflare R2 configuration");
  }

  return {
    endpoint,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicBaseUrl,
  };
}

let r2Client: S3Client | null = null;

function getR2Client(): S3Client {
  if (r2Client) return r2Client;
  const { endpoint, accessKeyId, secretAccessKey } = getR2Config();
  r2Client = new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
  return r2Client;
}

/**
 * Returns the stored public URL for this hash, or null if the file has not been recorded yet.
 */
export async function checkFileHash(fileHash: string): Promise<string | null> {
  assertValidFileHash(fileHash);
  try {
    const row = await prisma.uploadedImage.findUnique({
      where: { fileHash: fileHash.toLowerCase() },
      select: { url: true },
    });
    return row?.url ?? null;
  } catch (error) {
    console.error("checkFileHash:", error);
    throw new Error("Failed to check file hash");
  }
}

export type GetSignedUrlResult = {
  /** Presigned PUT URL for direct upload to R2. */
  signedUrl: string;
  /** Canonical public URL to persist after a successful upload. */
  publicUrl: string;
};

/**
 * Issues a presigned PUT URL for Cloudflare R2.
 * Returns `signedUrl` for the client PUT, and `publicUrl` to pass to `saveFileRecord` after success.
 */
export async function getSignedUrl(
  filename: string,
  contentType: string,
): Promise<GetSignedUrlResult> {
  assertValidObjectKey(filename);
  assertValidContentType(contentType);

  try {
    const { bucketName, publicBaseUrl } = getR2Config();
    const client = getR2Client();

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      ContentType: contentType.trim().toLowerCase(),
    });

    const signedUrl = await presignPutObject(client, command, {
      expiresIn: SIGNED_URL_TTL_SECONDS,
    });

    return {
      signedUrl,
      publicUrl: joinPublicUrl(publicBaseUrl, filename),
    };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Missing Cloudflare")) {
      throw error;
    }
    if (error instanceof Error && error.message.startsWith("Unsupported content")) {
      throw error;
    }
    if (error instanceof Error && error.message.startsWith("Invalid object key")) {
      throw error;
    }
    console.error("getSignedUrl:", error);
    throw new Error("Failed to generate signed URL");
  }
}

export type SaveFileRecordResult = {
  id: string;
  fileHash: string;
  url: string;
  createdAt: Date;
};

/**
 * Persists hash → URL after a successful R2 upload.
 * Idempotent for concurrent uploads: if the hash already exists, returns the existing row.
 */
export async function saveFileRecord(
  fileHash: string,
  url: string,
): Promise<SaveFileRecordResult> {
  assertValidFileHash(fileHash);
  const normalizedHash = fileHash.toLowerCase();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error("Invalid URL: must be http(s)");
  }

  try {
    return await prisma.uploadedImage.create({
      data: { fileHash: normalizedHash, url },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const existing = await prisma.uploadedImage.findUnique({
        where: { fileHash: normalizedHash },
      });
      if (existing) return existing;
    }
    console.error("saveFileRecord:", error);
    throw new Error("Failed to save file record");
  }
}
