import { describe, expect, it } from "vitest";

import { destinations } from "@/lib/data/destinations";

describe("destinations data", () => {
  it("exports unique destination slugs", () => {
    const slugs = destinations.map((destination) => destination.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
