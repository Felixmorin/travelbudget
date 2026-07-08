"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import type { AnalyticsEventPayload } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track";

type EmailCaptureFormProps = {
  buttonLabel: string;
  eventProperties: Omit<AnalyticsEventPayload<"email_capture">, "emailDomain">;
  inputLabel: string;
  placeholder?: string;
};

export function EmailCaptureForm({
  buttonLabel,
  eventProperties,
  inputLabel,
  placeholder = "you@example.com",
}: EmailCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/leads/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: normalizedEmail,
        ...eventProperties,
      }),
    }).catch(() => null);

    setIsSubmitting(false);

    if (!response?.ok) {
      setError("We could not save this request. Please try again.");
      return;
    }

    trackEvent("email_capture", {
      ...eventProperties,
      emailDomain: normalizedEmail.split("@").at(1),
    });
    setSubmitted(true);
  }

  return (
    <form className="grid gap-2" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="budget-email">
        {inputLabel}
      </label>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          id="budget-email"
          type="email"
          required
          disabled={isSubmitting}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(null);
            setSubmitted(false);
          }}
          placeholder={placeholder}
          className="h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[#0B1D34] focus:ring-3 focus:ring-[#0B1D34]/20"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 rounded-xl bg-[#0B1D34] font-bold text-white hover:bg-[#0B1D34]"
        >
          {isSubmitting ? "Saving..." : buttonLabel}
        </Button>
      </div>
      {submitted ? (
        <p className="text-sm font-medium text-[#006c49]" role="status">
          Request saved. We will contact you when the full budget handoff is available.
        </p>
      ) : null}
      {error ? (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
