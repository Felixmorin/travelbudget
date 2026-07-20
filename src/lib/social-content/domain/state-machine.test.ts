import { describe, expect, it } from "vitest";

import {
  assertContentStatusTransition,
  canTransitionContentStatus,
  getAllowedContentStatusTransitions,
  isTerminalContentStatus,
} from "@/lib/social-content/domain/state-machine";

describe("social content state machine", () => {
  it("allows the normal MVP draft-to-review path one step at a time", () => {
    expect(canTransitionContentStatus("draft", "topic_selected")).toBe(true);
    expect(canTransitionContentStatus("topic_selected", "data_validated")).toBe(true);
    expect(canTransitionContentStatus("rendering", "ready_for_review")).toBe(true);
  });

  it("rejects unsafe publication transitions", () => {
    expect(() => assertContentStatusTransition("draft", "published")).toThrow("Cannot transition");
    expect(getAllowedContentStatusTransitions("approved")).toEqual(["published"]);
    expect(isTerminalContentStatus("published")).toBe(true);
  });
});
