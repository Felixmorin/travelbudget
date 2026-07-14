import type { DateRange } from "@/lib/seo-agent/types";

const defaultLagDays = 3;
const defaultWindowDays = 28;

export function getDefaultSeoDateRanges(referenceDate = new Date()): {
  current: DateRange;
  previous: DateRange;
} {
  const end = addDays(startOfUtcDay(referenceDate), -defaultLagDays);
  const start = addDays(end, -(defaultWindowDays - 1));
  const previousEnd = addDays(start, -1);
  const previousStart = addDays(previousEnd, -(defaultWindowDays - 1));

  return {
    current: {
      startDate: toDateOnly(start),
      endDate: toDateOnly(end),
    },
    previous: {
      startDate: toDateOnly(previousStart),
      endDate: toDateOnly(previousEnd),
    },
  };
}

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}
