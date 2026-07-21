"use client";

import { type FormEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import { Mail, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track";
import type { TripBudgetLeadResponse, TripBudgetSnapshot } from "@/lib/leads/trip-budget-types";

type TripBudgetEmailCtaProps = {
  lead: TripBudgetSnapshot;
  ctaLocation: string;
  className?: string;
};

const successMessage = "Your trip budget is on its way. Check your inbox in the next few minutes.";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function TripBudgetEmailCta({ className, ctaLocation, lead }: TripBudgetEmailCtaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const analyticsProperties = useMemo(
    () => ({
      page: lead.sourcePage,
      source: "trip_budget_email",
      ctaLocation,
      origin: lead.origin,
      destination: lead.destination ?? lead.destinations[0]?.title ?? null,
      budget: lead.budgetAmount,
      budgetRange: lead.budgetRange,
      currency: lead.budgetCurrency,
      days: lead.tripDurationDays,
      tripLength: lead.tripDurationDays,
      travelers: lead.travelerCount,
      travelStyle: lead.travelStyle,
      deviceType: "unknown",
    }),
    [ctaLocation, lead]
  );

  useEffect(() => {
    trackEvent("trip_budget_email_cta_viewed", analyticsProperties);
  }, [analyticsProperties]);

  function openModal() {
    trackEvent("trip_budget_email_cta_clicked", analyticsProperties);
    setIsOpen(true);
  }

  return (
    <>
      <Button
        type="button"
        className={className ?? "h-12 rounded-full bg-[#0B1D34] px-6 font-bold text-white hover:bg-[#0B1D34]"}
        onClick={openModal}
      >
        <Mail className="mr-2 size-4" />
        Send me this trip budget
      </Button>
      {isOpen ? (
        <TripBudgetEmailModal
          analyticsProperties={analyticsProperties}
          lead={lead}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </>
  );
}

function TripBudgetEmailModal({
  analyticsProperties,
  lead,
  onClose,
}: {
  analyticsProperties: Parameters<typeof trackEvent<"trip_budget_email_cta_clicked">>[1];
  lead: TripBudgetSnapshot;
  onClose: () => void;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const submittedAtRef = useRef<number | null>(null);
  const [email, setEmail] = useState("");
  const [budgetEmailConsent, setBudgetEmailConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    submittedAtRef.current = Date.now();
    firstInputRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const form = new FormData(event.currentTarget);
    const website = String(form.get("website") ?? "");

    if (!emailPattern.test(normalizedEmail) || normalizedEmail.length > 254) {
      setError("Enter a valid email address.");
      return;
    }

    if (!budgetEmailConsent) {
      setError("Confirm that we can email this trip budget.");
      return;
    }

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setError("You appear to be offline. Reconnect and try again.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    trackEvent("trip_budget_email_form_submitted", analyticsProperties);

    const response = await fetch("/api/leads/trip-budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: normalizedEmail,
        budgetEmailConsent,
        marketingConsent,
        consentTimestamp: new Date().toISOString(),
        submittedAt: submittedAtRef.current ?? Date.now(),
        website,
        lead: {
          ...lead,
          resultUrl: lead.resultUrl ?? window.location.href,
        },
        ...getUtmParams(),
      }),
    }).catch(() => null);

    setIsSubmitting(false);

    const result = (await response?.json().catch(() => null)) as TripBudgetLeadResponse | null;

    if (!response?.ok || !result?.ok) {
      setError(result?.error ?? "We could not send this budget right now. Please try again.");
      trackEvent("trip_budget_email_failed", {
        ...analyticsProperties,
        emailStatus: result?.emailStatus ?? "failed",
      });
      return;
    }

    trackEvent("trip_budget_email_sent", {
      ...analyticsProperties,
      emailStatus: result.emailStatus ?? "sent",
    });
    setIsSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id={titleId} className="text-xl font-semibold tracking-normal text-[#191c1e]">
              Send me this trip budget
            </h2>
            <p id={descriptionId} className="mt-1 text-sm leading-6 text-[#434655]">
              We will email the estimate shown on this page.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
            disabled={isSubmitting}
            aria-label="Close"
            onClick={onClose}
          >
            <X className="size-5" />
          </Button>
        </div>

        {isSubmitted ? (
          <div className="grid gap-4 px-5 py-6">
            <p className="rounded-2xl bg-[#e7f7ef] px-4 py-3 text-sm font-semibold text-[#006c49]" role="status">
              {successMessage}
            </p>
            <Button type="button" className="h-11 rounded-xl bg-[#0B1D34] text-white hover:bg-[#0B1D34]" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <form className="grid gap-4 px-5 py-6" onSubmit={handleSubmit}>
            <input name="website" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <label className="grid gap-2 text-sm font-semibold text-[#434655]" htmlFor="trip-budget-lead-email">
              Email address
              <input
                ref={firstInputRef}
                id="trip-budget-lead-email"
                type="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(null);
                }}
                placeholder="you@example.com"
                className="h-12 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-base text-slate-950 outline-none focus:border-[#0B1D34] focus:ring-3 focus:ring-[#0B1D34]/20"
              />
            </label>

            <label className="flex items-start gap-3 text-sm leading-6 text-[#434655]">
              <input
                type="checkbox"
                required
                disabled={isSubmitting}
                checked={budgetEmailConsent}
                onChange={(event) => {
                  setBudgetEmailConsent(event.target.checked);
                  setError(null);
                }}
                className="mt-1 size-4 rounded border-slate-300"
              />
              <span>I agree to receive this trip budget by email.</span>
            </label>

            <label className="flex items-start gap-3 text-sm leading-6 text-[#434655]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                checked={marketingConsent}
                onChange={(event) => setMarketingConsent(event.target.checked)}
                className="mt-1 size-4 rounded border-slate-300"
              />
              <span>Send me occasional budget travel ideas and updates.</span>
            </label>

            <p className="text-xs leading-5 text-[#737686]">
              We&apos;ll use your email to send this trip budget. Marketing emails are optional. See our{" "}
              <a className="font-semibold text-[#0B1D34] underline" href="/privacy">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a className="font-semibold text-[#0B1D34] underline" href="/terms">
                Terms
              </a>
              .
            </p>

            {error ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 rounded-xl bg-[#0B1D34] font-bold text-white hover:bg-[#0B1D34]"
            >
              {isSubmitting ? "Sending..." : "Send me this trip budget"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    utmContent: params.get("utm_content") ?? undefined,
  };
}
