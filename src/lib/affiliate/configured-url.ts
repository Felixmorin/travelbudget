const bracketPlaceholderPattern = /^\s*\[\[[^\]]+\]\]\s*$/;
const anglePlaceholderPattern = /^\s*<[^>]+>\s*$/;

const placeholderTokens = [
  "placeholder",
  "changeme",
  "change_me",
  "change-me",
  "todo",
  "tbd",
  "your_",
  "your-",
  "example_",
  "example-",
  "colle_ici",
];

export function isAffiliatePlaceholderValue(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return false;
  }

  return (
    bracketPlaceholderPattern.test(value ?? "") ||
    anglePlaceholderPattern.test(value ?? "") ||
    placeholderTokens.some((token) => normalized.includes(token))
  );
}

export function getConfiguredAffiliateUrl(value: string | null | undefined, fallback?: string) {
  const candidate = value?.trim();

  if (candidate) {
    return isAffiliatePlaceholderValue(candidate) ? undefined : candidate;
  }

  const fallbackCandidate = fallback?.trim();

  return fallbackCandidate && !isAffiliatePlaceholderValue(fallbackCandidate) ? fallbackCandidate : undefined;
}
