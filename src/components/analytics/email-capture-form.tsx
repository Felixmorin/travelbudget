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
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
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
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setSubmitted(false);
          }}
          placeholder={placeholder}
          className="h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[#0B1D34] focus:ring-3 focus:ring-[#0B1D34]/20"
        />
        <Button type="submit" className="h-12 rounded-xl bg-[#0B1D34] font-bold text-white hover:bg-[#0B1D34]">
          {buttonLabel}
        </Button>
      </div>
      {submitted ? (
        <p className="text-sm font-medium text-[#006c49]" role="status">
          Budget sent. Check your inbox shortly.
        </p>
      ) : null}
    </form>
  );
}
