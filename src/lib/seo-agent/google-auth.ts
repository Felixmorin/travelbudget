import { createSign } from "node:crypto";

const tokenUrl = "https://oauth2.googleapis.com/token";
const tokenGrantType = "urn:ietf:params:oauth:grant-type:jwt-bearer";

export type GoogleServiceAccountConfig = {
  clientEmail: string;
  privateKey: string;
};

export function getGoogleServiceAccountConfig(): GoogleServiceAccountConfig {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);

  if (!clientEmail || !privateKey) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY are required.");
  }

  return { clientEmail, privateKey };
}

export async function getGoogleAccessToken(scopes: string[]) {
  const serviceAccount = getGoogleServiceAccountConfig();
  const now = Math.floor(Date.now() / 1000);
  const assertion = signJwt(
    {
      alg: "RS256",
      typ: "JWT",
    },
    {
      iss: serviceAccount.clientEmail,
      scope: scopes.join(" "),
      aud: tokenUrl,
      exp: now + 3600,
      iat: now,
    },
    serviceAccount.privateKey
  );

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: tokenGrantType,
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google OAuth token request failed with status ${response.status}.`);
  }

  const body = (await response.json()) as { access_token?: unknown };

  if (typeof body.access_token !== "string") {
    throw new Error("Google OAuth token response did not include an access token.");
  }

  return body.access_token;
}

function signJwt(header: Record<string, unknown>, payload: Record<string, unknown>, privateKey: string) {
  const unsignedToken = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();

  return `${unsignedToken}.${signer.sign(privateKey, "base64url")}`;
}

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function normalizePrivateKey(value: string | undefined) {
  return value?.trim().replace(/\\n/g, "\n");
}
