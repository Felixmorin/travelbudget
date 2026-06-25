"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { Bell, CheckCircle2, Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics/track";
import { isValidEmail, type LeadCaptureIntent } from "@/lib/leads/lead-capture";
import { cn } from "@/lib/utils";

type EmailCaptureVariant = "card" | "compact" | "inline";

type EmailCaptureProps = {
  intent: LeadCaptureIntent;
  origin?: string;
  destination?: string;
  budget?: number;
  duration?: number;
  variant?: EmailCaptureVariant;
  source: string;
  className?: string;
};

const copyByIntent = {
  trip_budget: {
    title: "Send me this trip budget",
    description: "Get this estimate in your inbox so you can compare it later.",
    button: "Send budget",
    success: "Budget sent. Check your inbox soon.",
  },
  price_alert: {
    title: "Get price alerts for this destination",
    description: "We will let you know when a better planning window appears.",
    button: "Get alerts",
    success: "Alert request saved. We will use this route context.",
  },
} satisfies Record<LeadCaptureIntent, { title: string; description: string; button: string; success: string }>;

export function EmailCapture({
  intent,
  origin,
  destination,
  budget,
  duration,
  variant = "card",
  source,
  className,
}: EmailCaptureProps) {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const copy = copyByIntent[intent];
  const Icon = intent === "price_alert" ? Bell : Mail;
  const analyticsProperties = useMemo(
    () => ({
      page: pathname,
      source,
      originCity: origin,
      destinationName: destination,
      budget,
      days: duration,
      tripLength: duration,
      intent,
      variant,
    }),
    [budget, destination, duration, intent, origin, pathname, source, variant]
  );

  useEffect(() => {
    trackEvent("email_capture_viewed", analyticsProperties);
  }, [analyticsProperties]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!isValidEmail(normalizedEmail)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      trackEvent("email_capture_error", {
        ...analyticsProperties,
        error: "invalid_email",
      });
      return;
    }

    setStatus("loading");
    setMessage("");
    trackEvent("email_capture_submitted", analyticsProperties);

    try {
      const response = await fetch("/api/lead-capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          intent,
          destination,
          origin,
          budget,
          duration,
          source,
          pathname,
        }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "Unable to save this email request.");
      }

      setStatus("success");
      setMessage(copy.success);
      setEmail("");
      trackEvent("email_capture_success", analyticsProperties);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unable to save this email request.";

      setStatus("error");
      setMessage(errorMessage);
      trackEvent("email_capture_error", {
        ...analyticsProperties,
        error: errorMessage,
      });
    }
  }

  return (
    <section
      className={cn(
        "border border-slate-200 bg-white shadow-sm",
        variant === "compact" ? "rounded-2xl p-4" : "rounded-[24px] p-5",
        variant === "inline" ? "shadow-none" : "",
        className
      )}
    >
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-950">{copy.title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{copy.description}</p>
        </div>
      </div>

      <form className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
        <Input
          aria-label="Email address"
          aria-invalid={status === "error"}
          className="h-11 rounded-xl bg-white px-3"
          disabled={status === "loading"}
          inputMode="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          type="email"
          value={email}
        />
        <Button className="h-11 rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700" disabled={status === "loading"} type="submit">
          {status === "loading" ? (
            "Saving..."
          ) : status === "success" ? (
            <>
              <CheckCircle2 className="mr-2 size-4" />
              Saved
            </>
          ) : (
            <>
              {copy.button}
              <Send className="ml-2 size-4" />
            </>
          )}
        </Button>
      </form>

      {message ? (
        <p className={cn("mt-3 text-sm", status === "error" ? "text-red-600" : "text-emerald-700")}>{message}</p>
      ) : null}
    </section>
  );
}
