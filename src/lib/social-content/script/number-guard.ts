export type AllowedNumericClaim = {
  value: number;
  label: string;
};

export type NumericClaimValidation = {
  ok: boolean;
  claims: number[];
  unauthorizedClaims: number[];
};

export function validateNumericClaims(text: string, allowedClaims: AllowedNumericClaim[]): NumericClaimValidation {
  const allowedValues = new Set(allowedClaims.map((claim) => Math.round(claim.value)));
  const claims = extractNumericClaims(text);
  const unauthorizedClaims = claims.filter((claim) => !allowedValues.has(claim));

  return {
    ok: unauthorizedClaims.length === 0,
    claims,
    unauthorizedClaims,
  };
}

export function extractNumericClaims(text: string) {
  const matches = text.match(/\d[\d\s,.]*/g) ?? [];

  return Array.from(
    new Set(
      matches
        .map((match) => Number.parseFloat(match.replace(/[\s,]/g, "")))
        .filter((value) => Number.isFinite(value))
        .map((value) => Math.round(value))
    )
  );
}
