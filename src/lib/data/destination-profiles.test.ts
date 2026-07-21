import { describe, expect, it } from "vitest";

import { getDestinationProfile, priorityDestinationProfileSlugs, validateDestinationProfileCrossMentions } from "@/lib/data/destination-profiles";
import { getUnifiedDestination, unifiedDestinations } from "@/lib/data/unified-destinations";

describe("destination profiles", () => {
  it("fully customizes the priority destination profiles", () => {
    expect(priorityDestinationProfileSlugs).toEqual([
      "lisbon",
      "porto",
      "paris",
      "tokyo",
      "mexico-city",
      "bangkok",
      "seoul",
      "rome",
      "barcelona",
      "cancun",
    ]);

    for (const slug of priorityDestinationProfileSlugs) {
      const destination = getUnifiedDestination(slug);
      expect(destination, slug).toBeTruthy();

      const profile = getDestinationProfile(destination!);

      expect(profile.idealFor.length, slug).toBeGreaterThanOrEqual(5);
      expect(profile.notIdealFor.length, slug).toBeGreaterThanOrEqual(3);
      expect(profile.tripScenarios.length, slug).toBe(3);
      expect(profile.localCosts.length, slug).toBeGreaterThanOrEqual(5);
      expect(profile.savingsTips.length, slug).toBeGreaterThanOrEqual(3);
      expect(profile.comparisons?.length, slug).toBeGreaterThanOrEqual(2);
      expect(profile.bookingAdvice.flights, slug).toContain("flight");
      expect(profile.itinerary?.[3]?.length, slug).toBe(3);
      expect(profile.itinerary?.[5]?.length, slug).toBe(5);
      expect(profile.itinerary?.[7]?.length, slug).toBe(7);
      expect(profile.itinerary?.[10]?.length, slug).toBe(10);
    }
  });

  it("builds useful derived profiles for non-priority destinations", () => {
    const destination = getUnifiedDestination("vietnam");
    expect(destination).toBeTruthy();

    const profile = getDestinationProfile(destination!);

    expect(profile.enabledModules).toContain("editorialVerdict");
    expect(profile.enabledModules).toContain("localCosts");
    expect(profile.enabledModules).toContain("itinerary");
    expect(profile.enabledModules).not.toContain("neighborhoods");
    expect(profile.localCosts.length).toBeGreaterThanOrEqual(5);
    expect(profile.itinerary?.[3]?.length).toBe(3);
    expect(profile.itinerary?.[5]?.length).toBe(5);
    expect(profile.itinerary?.[7]?.length).toBe(7);
    expect(profile.itinerary?.[10]?.length).toBe(10);
  });

  it("gives every destination decision modules without forcing unsupported neighborhoods", () => {
    for (const destination of unifiedDestinations) {
      const profile = getDestinationProfile(destination);

      expect(profile.enabledModules, destination.slug).toContain("editorialVerdict");
      expect(profile.enabledModules, destination.slug).toContain("budgetScenarios");
      expect(profile.enabledModules, destination.slug).toContain("localCosts");
      expect(profile.enabledModules, destination.slug).toContain("itinerary");
      expect(profile.localCosts.length, destination.slug).toBeGreaterThanOrEqual(5);
      expect(profile.itinerary?.[3]?.length, destination.slug).toBe(3);
      expect(profile.itinerary?.[5]?.length, destination.slug).toBe(5);
      expect(profile.itinerary?.[7]?.length, destination.slug).toBe(7);
      expect(profile.itinerary?.[10]?.length, destination.slug).toBe(10);

      if (!profile.neighborhoods?.length) {
        expect(profile.enabledModules, destination.slug).not.toContain("neighborhoods");
      }
    }
  });

  it("does not include unexpected cross-destination mentions in priority editorial data", () => {
    const profiles = priorityDestinationProfileSlugs.map((slug) => getDestinationProfile(getUnifiedDestination(slug)!));

    expect(validateDestinationProfileCrossMentions(profiles)).toEqual([]);
  });

  it("does not expose technical source keys in public profile text", () => {
    const forbidden = ["manual-planning-rate", "raw_source", "table_name", "source_id", "internal_id"];
    const publicText = JSON.stringify(unifiedDestinations.map((destination) => getDestinationProfile(destination))).toLowerCase();

    for (const term of forbidden) {
      expect(publicText).not.toContain(term);
    }
  });
});
