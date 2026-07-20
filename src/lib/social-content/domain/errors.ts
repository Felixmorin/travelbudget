export class SocialContentError extends Error {
  code: string;
  details: Record<string, string | number | boolean | null | undefined>;

  constructor(
    code: string,
    message: string,
    details: Record<string, string | number | boolean | null | undefined> = {}
  ) {
    super(message);
    this.name = "SocialContentError";
    this.code = code;
    this.details = details;
  }
}

export function getSocialContentErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown social content error.";
}
