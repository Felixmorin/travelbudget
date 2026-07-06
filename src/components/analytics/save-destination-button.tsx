"use client";

import { FormEvent, useEffect, useState } from "react";
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
  const [email, setEmail] = useState(() =>
    typeof window === "undefined" ? "" : window.localStorage.getItem("travelbudget:saved-trip-email") ?? ""
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  useEffect(() => {
    const storedEmail = email.trim().toLowerCase();

    if (!storedEmail || !eventProperties.destinationSlug) {
      return;
    }

    const params = new URLSearchParams({
      email: storedEmail,
      destinationSlug: eventProperties.destinationSlug,
    });

    fetch(`/api/saved-trips?${params.toString()}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => setIsSaved(Boolean(payload?.saved)))
      .catch(() => setIsSaved(false));
  }, [email, eventProperties.destinationSlug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!eventProperties.destinationSlug) {
      return;
    }

    setStatus("saving");

    const response = await fetch("/api/saved-trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        destinationSlug: eventProperties.destinationSlug,
        source: eventProperties.source ?? "save_destination_button",
        pathname: window.location.pathname,
      }),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    window.localStorage.setItem("travelbudget:saved-trip-email", email.trim().toLowerCase());
    setIsSaved(true);
    setIsOpen(false);
    setStatus("idle");
    trackEvent("destination_saved", {
      ...eventProperties,
      savedState: true,
    });
  }

  return (
    <div className="absolute right-4 top-4 z-10">
      <Button
        type="button"
        size="icon"
        variant="secondary"
        aria-pressed={isSaved}
        aria-label={isSaved ? "Destination saved" : "Save destination by email"}
        className={cn(
          "size-9 rounded-full border border-white/70 bg-white/90 text-blue-700 shadow-md hover:bg-white",
          isSaved ? "text-orange-600" : ""
        )}
        onClick={() => setIsOpen((current) => !current)}
      >
        <Bookmark className={cn("size-4", isSaved ? "fill-current" : "")} />
      </Button>
      {isOpen ? (
        <form
          className="mt-2 grid w-64 gap-2 rounded-lg border border-slate-200 bg-white p-3 text-left shadow-xl"
          onSubmit={handleSubmit}
        >
          <label className="text-xs font-semibold text-slate-700" htmlFor={`${storageKey}-email`}>
            Save with email
          </label>
          <input
            id={`${storageKey}-email`}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
            placeholder="you@example.com"
            className="h-9 rounded-md border border-slate-300 px-3 text-sm text-slate-950 outline-none focus:border-blue-600"
          />
          {status === "error" ? <p className="text-xs text-red-600">Unable to save this destination.</p> : null}
          {isSaved ? <p className="text-xs text-emerald-700">Saved to this email.</p> : null}
          <Button type="submit" size="sm" disabled={status === "saving"} className="h-9 rounded-md">
            {status === "saving" ? "Saving..." : "Save"}
          </Button>
        </form>
      ) : null}
    </div>
  );
}
