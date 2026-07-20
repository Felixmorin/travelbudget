import { describe, expect, it } from "vitest";

import { extractNumericClaims, validateNumericClaims } from "@/lib/social-content/script/number-guard";

describe("social script number guard", () => {
  it("extracts normalized numeric claims from formatted money", () => {
    expect(extractNumericClaims("About $1,500 CAD for 7 days and $214 per day.")).toEqual([1500, 7, 214]);
  });

  it("rejects numbers that are not in the allowed claims", () => {
    expect(
      validateNumericClaims("This costs $1,499.", [{ value: 1500, label: "budget" }])
    ).toMatchObject({
      ok: false,
      unauthorizedClaims: [1499],
    });
  });
});
