import { checkFileHash, getSignedUrl, saveFileRecord } from "@/app/action/upload";

const MAX_BYTES = 10 * 1024 * 1024;

async function sha256Hex(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const bytes = new Uint8Array(hashBuffer);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function extensionFromFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? name;
  const parts = base.split(".");
  if (parts.length < 2) return "bin";
  const ext = parts.pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "bin";
  return ext.slice(0, 8) || "bin";
}

/**
 * Full R2 upload + dedupe (checkFileHash → getSignedUrl → PUT → saveFileRecord).
 * Call from the client only when the form is submitted.
 */
export async function uploadDormImageToR2(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("ไฟล์ต้องขนาดไม่เกิน 10MB");
  }

  const fileHash = await sha256Hex(file);
  const existingUrl = await checkFileHash(fileHash);
  if (existingUrl) return existingUrl;

  const ext = extensionFromFilename(file.name);
  const objectKey = `uploads/${fileHash}.${ext}`;
  const { signedUrl, publicUrl } = await getSignedUrl(objectKey, file.type);

  const putRes = await fetch(signedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  if (!putRes.ok) {
    const detail = await putRes.text().catch(() => "");
    throw new Error(
      detail
        ? `อัปโหลดไม่สำเร็จ (${putRes.status})`
        : `อัปโหลดไม่สำเร็จ (${putRes.status})`,
    );
  }

  await saveFileRecord(fileHash, publicUrl);
  return publicUrl;
}
