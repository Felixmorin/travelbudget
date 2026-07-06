import { headers } from "next/headers";

export async function verifyAdminAccess(searchParams?: { admin_secret?: string | string[]; token?: string | string[] }) {
  const configuredSecret = process.env.ADMIN_DASHBOARD_SECRET?.trim();

  if (!configuredSecret) {
    return false;
  }

  const headerList = await headers();
  const providedSecret =
    headerList.get("x-admin-secret") ??
    readParam(searchParams?.admin_secret) ??
    readParam(searchParams?.token) ??
    "";

  return constantTimeEqual(providedSecret, configuredSecret);
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function constantTimeEqual(left: string, right: string) {
  if (!left || left.length !== right.length) {
    return false;
  }

  let result = 0;

  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}
