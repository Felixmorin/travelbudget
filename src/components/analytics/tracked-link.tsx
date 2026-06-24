"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

import type { AnalyticsEventName, AnalyticsEventPayload } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track";

type TrackedLinkProps<EventName extends AnalyticsEventName> = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | "href" | "onClick"> & {
    children: ReactNode;
    eventName: EventName;
    eventProperties?: AnalyticsEventPayload<EventName>;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  };

export function TrackedLink<EventName extends AnalyticsEventName>({
  children,
  eventName,
  eventProperties,
  onClick,
  ...props
}: TrackedLinkProps<EventName>) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackEvent(eventName, eventProperties);
    onClick?.(event);
  }

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
