"use client";

import { useSyncExternalStore } from "react";
import { Bookmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AnalyticsEventPayload } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";

type SaveDestinationButtonProps = {
  eventProperties: AnalyticsEventPayload<"destination_saved">;
  storageKey: string;
};

export function SaveDestinationButton({ eventProperties, storageKey }: SaveDestinationButtonProps) {
  const isSaved = useSyncExternalStore(
    subscribeToStorage,
    () => window.localStorage.getItem(storageKey) === "true",
    () => false
  );

  function handleClick() {
    const nextSavedState = !isSaved;

    window.localStorage.setItem(storageKey, String(nextSavedState));
    window.dispatchEvent(new StorageEvent("storage", { key: storageKey, newValue: String(nextSavedState) }));
    trackEvent("destination_saved", {
      ...eventProperties,
      savedState: nextSavedState,
    });
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="secondary"
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove saved destination" : "Save destination"}
      className={cn(
        "absolute right-4 top-4 z-10 size-9 rounded-full border border-white/70 bg-white/90 text-blue-700 shadow-md hover:bg-white",
        isSaved ? "text-orange-600" : ""
      )}
      onClick={handleClick}
    >
      <Bookmark className={cn("size-4", isSaved ? "fill-current" : "")} />
    </Button>
  );
}

function subscribeToStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);

  return () => window.removeEventListener("storage", onStoreChange);
}
