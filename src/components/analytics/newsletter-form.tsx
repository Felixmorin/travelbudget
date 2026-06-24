"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track";

export function NewsletterForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("newsletter_submitted", {
      page: "/guides",
      newsletterLocation: "weekly_budgeter",
    });
  }

  return (
    <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <input
        className="h-12 flex-1 rounded-xl border border-white/30 bg-white/20 px-4 text-white outline-none placeholder:text-white/70 focus:ring-2 focus:ring-white/70"
        placeholder="Your email address"
        type="email"
      />
      <Button className="h-12 rounded-xl bg-white px-6 font-bold text-[#004ac6] hover:bg-white/90">Subscribe</Button>
    </form>
  );
}

