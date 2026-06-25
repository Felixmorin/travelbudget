"use client";

import type { FormHTMLAttributes, ReactNode, SyntheticEvent } from "react";

import type { AnalyticsEventPayload } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track";

type TrackedFormProps = Omit<FormHTMLAttributes<HTMLFormElement>, "onChange"> & {
  children: ReactNode;
  eventProperties: Omit<AnalyticsEventPayload<"filter_changed">, "filterName" | "filterValue" | "previousValue">;
};

export function TrackedFilterForm({ children, eventProperties, ...props }: TrackedFormProps) {
  function handleChange(event: SyntheticEvent<HTMLFormElement>) {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;

    if (!target?.name) {
      return;
    }

    trackEvent("filter_changed", {
      ...eventProperties,
      filterName: target.name,
      filterValue: target.value,
    });
  }

  return (
    <form {...props} onChange={handleChange}>
      {children}
    </form>
  );
}
