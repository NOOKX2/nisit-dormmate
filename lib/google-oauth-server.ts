/** Server-only: ใช้ CLIENT_SECRET — อย่า import จาก client components */
type GoogleTokenResponse = {
  access_token: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
  error_description?: string;
};

export type GoogleUserInfo = {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
};

export async function exchangeGoogleCode(params: {
  code: string;
  redirectUri: string;
  clientId: string;
  clientSecret: string;
}): Promise<string> {
  const body = new URLSearchParams({
    code: params.code,
    client_id: params.clientId,
    client_secret: params.clientSecret,
    redirect_uri: params.redirectUri,
    grant_type: "authorization_code",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const data = (await res.json()) as GoogleTokenResponse;
  if (!res.ok || data.error || !data.access_token) {
    throw new Error(
      data.error_description || data.error || "Failed to exchange OAuth code",
    );
  }
  return data.access_token;
}

export async function fetchGoogleUserInfo(
  accessToken: string,
): Promise<GoogleUserInfo> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google userinfo failed: ${res.status} ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<GoogleUserInfo>;
}
