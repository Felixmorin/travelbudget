import { getErrorMessage } from "@/lib/monitoring/server-logger";

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const rateLimitBuckets = new Map<string, RateLimitBucket>();

export class RequestGuardError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "RequestGuardError";
    this.status = status;
  }
}

export function enforceRequestSize(request: Request, maxBytes: number) {
  const contentLength = request.headers.get("content-length");

  if (contentLength && Number(contentLength) > maxBytes) {
    throw new RequestGuardError("Request body is too large.", 413);
  }
}

export async function readJsonBody(request: Request, maxBytes: number) {
  enforceRequestSize(request, maxBytes);

  try {
    const body = await request.json();
    const serializedBody = JSON.stringify(body);

    if (serializedBody.length > maxBytes) {
      throw new RequestGuardError("Request body is too large.", 413);
    }

    return body;
  } catch (error) {
    if (error instanceof RequestGuardError) {
      throw error;
    }

    throw new RequestGuardError(getErrorMessage(error) || "Invalid JSON body.", 400);
  }
}

export function enforceRateLimit(request: Request, scope: string, options: RateLimitOptions) {
  const key = `${scope}:${getClientIdentifier(request)}`;
  const now = Date.now();
  const currentBucket = rateLimitBuckets.get(key);
  const bucket =
    currentBucket && currentBucket.resetAt > now
      ? currentBucket
      : {
          count: 0,
          resetAt: now + options.windowMs,
        };

  bucket.count += 1;
  rateLimitBuckets.set(key, bucket);

  if (bucket.count > options.limit) {
    throw new RequestGuardError("Too many requests.", 429);
  }
}

export function getRequestGuardResponse(error: unknown) {
  if (error instanceof RequestGuardError) {
    return Response.json({ ok: false, error: error.message }, { status: error.status });
  }

  return null;
}

export function resetRequestGuardState() {
  rateLimitBuckets.clear();
}

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();

  return forwardedFor || realIp || "unknown";
}
