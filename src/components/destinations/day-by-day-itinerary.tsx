"use client";

import { CalendarDays, ChevronDown, ExternalLink, MapPinned, Route, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type DayByDayItineraryDestination = {
  slug: string;
  name: string;
  cityName?: string;
  countryName?: string;
  travelStyles: string[];
  itineraryPreview: string[];
};

type ItineraryLength = 7 | 10 | 12;

type ItineraryDay = {
  day: number;
  title: string;
  description: string;
  pace: string;
};

type DayActivity = {
  title: string;
  description: string;
  duration: string;
};

const itineraryLengths = [7, 10, 12] as const;

const mexicoCityPlans: Record<ItineraryLength, Omit<ItineraryDay, "day">[]> = {
  7: [
    day("Arrival, Roma Norte, and first tacos", "Settle into Roma or Condesa, walk the neighborhood, and keep the first evening easy with taquerias and a low-pressure mezcal bar.", "Easy"),
    day("Historic Center and major murals", "Visit Zocalo, the cathedral area, Palacio de Bellas Artes, and Diego Rivera murals, then finish with a rooftop or cantina stop.", "Full"),
    day("Chapultepec and anthropology museum", "Build the day around Bosque de Chapultepec, the National Museum of Anthropology, and Polanco or Condesa dinner.", "Full"),
    day("Coyoacan, Frida Kahlo, and markets", "Book Frida Kahlo tickets early, add Coyoacan market, churros, plazas, and a slower cafe-heavy afternoon.", "Moderate"),
    day("Teotihuacan day trip", "Use a guided or self-directed day trip for the pyramids, then keep the evening simple back in the city.", "Full"),
    day("Xochimilco and southern neighborhoods", "Pair a trajinera ride with UNAM, San Angel, or a food-focused afternoon depending on budget and energy.", "Moderate"),
    day("Food, design, and departure buffer", "Use the final day for coffee, markets, shopping, a cooking class, or a flexible museum before departure.", "Easy"),
  ],
  10: [
    day("Arrival and Roma Norte", "Check in, walk Roma Norte, and start with tacos, pan dulce, or a casual dinner close to the hotel.", "Easy"),
    day("Historic Center deep dive", "Cover Zocalo, Templo Mayor, Bellas Artes, murals, and a classic cantina or rooftop view.", "Full"),
    day("Chapultepec and Anthropology Museum", "Spend a focused day around Chapultepec Castle, the park, and the anthropology museum.", "Full"),
    day("Coyoacan and Frida Kahlo", "Reserve Frida Kahlo Museum, visit Coyoacan market, and keep time for plazas and cafes.", "Moderate"),
    day("Teotihuacan or hot air balloon splurge", "Plan the biggest paid experience here: pyramids by guided tour, self-guided bus, or balloon upgrade.", "Full"),
    day("Condesa, Roma, and food crawl", "Keep this day local with coffee, parks, design shops, street food, and a guided food walk if budget allows.", "Easy"),
    day("Xochimilco and UNAM", "Head south for canals, university murals, San Angel, or a quieter neighborhood day.", "Moderate"),
    day("Museum choice day", "Choose between Soumaya/Jumex, Museo Tamayo, Museo de Arte Popular, or another specialty museum.", "Moderate"),
    day("Puebla or Taxco day trip", "Add one bigger side trip if you want a second city, architecture, crafts, or regional food.", "Full"),
    day("Markets and flexible departure day", "Use the last day for Mercado Medellin, La Ciudadela, a cooking class, or simple buffer time.", "Easy"),
  ],
  12: [
    day("Arrival and low-pressure first night", "Stay near Roma, Condesa, or Reforma and keep the first evening close to base.", "Easy"),
    day("Historic Center essentials", "Visit Zocalo, Templo Mayor, Bellas Artes, Alameda Central, and a classic lunch stop.", "Full"),
    day("Chapultepec museums", "Give Chapultepec enough time for the castle, anthropology museum, park walks, and dinner nearby.", "Full"),
    day("Coyoacan, Frida Kahlo, and San Angel", "Slow the south-side visit down with museum tickets, markets, plazas, and galleries.", "Moderate"),
    day("Teotihuacan day trip", "Use a full day for the pyramids and budget extra if choosing a guided tour or balloon experience.", "Full"),
    day("Roma and Condesa food day", "Plan a food walk, bakery crawl, parks, bookstores, and a lighter activity day.", "Easy"),
    day("Xochimilco, UNAM, and canals", "Pair the trajineras with campus murals or a southern neighborhood dinner.", "Moderate"),
    day("Contemporary art and Polanco", "Visit Jumex, Soumaya, galleries, parks, and a more polished dinner if it fits the budget.", "Moderate"),
    day("Puebla day trip", "Add colonial architecture, mole, churches, and regional food on a long but manageable day trip.", "Full"),
    day("Lucha libre or nightlife", "Keep the day flexible, then add lucha libre, cocktails, or a guided evening activity.", "Moderate"),
    day("Markets, cooking, or floating buffer", "Use this day for a cooking class, La Merced, La Ciudadela, or anything weather disrupted earlier.", "Easy"),
    day("Final breakfast and departure", "Keep logistics simple with breakfast, final shopping, and transit buffer.", "Easy"),
  ],
};

export function DayByDayItinerary({
  activityHref,
  destination,
}: {
  activityHref?: string;
  destination: DayByDayItineraryDestination;
}) {
  const [selectedLength, setSelectedLength] = useState<ItineraryLength>(7);
  const [openDay, setOpenDay] = useState(1);
  const plans = useMemo(() => getItineraryPlans(destination), [destination]);
  const selectedPlan = plans[selectedLength];
  const destinationLabel = destination.cityName && destination.countryName
    ? `${destination.cityName}, ${destination.countryName}`
    : destination.name;

  return (
    <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/60">
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0B1D34]">Day-by-day planner</p>
            <CardTitle className="mt-2 text-2xl text-slate-950">
              {destinationLabel} itinerary
            </CardTitle>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Pick a trip length to see a practical daily structure. Use it as a planning draft, then adjust paid
              tours, rest days, and neighborhoods around your budget.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1">
            {itineraryLengths.map((length) => (
              <Button
                key={length}
                type="button"
                variant={selectedLength === length ? "default" : "ghost"}
                className={`h-9 rounded-lg px-3 ${
                  selectedLength === length ? "bg-[#0B1D34] text-white hover:bg-[#0B1D34]/90" : "text-slate-700"
                }`}
                onClick={() => {
                  setSelectedLength(length);
                  setOpenDay(1);
                }}
              >
                {length} days
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-3 rounded-xl border border-[#14B8A6]/20 bg-[#14B8A6]/10 p-4 sm:grid-cols-3">
          <ItineraryStat icon={CalendarDays} label="Trip length" value={`${selectedLength} days`} />
          <ItineraryStat icon={Route} label="Pace" value={getPaceLabel(selectedPlan)} />
          <ItineraryStat icon={Sparkles} label="Best for" value={destination.travelStyles.slice(0, 2).join(" + ") || "Flexible"} />
        </div>
        <div className="grid gap-3">
          {selectedPlan.map((item) => (
            <article key={item.day} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <button
                type="button"
                aria-expanded={openDay === item.day}
                className="grid w-full gap-4 p-4 text-left transition hover:bg-white sm:grid-cols-[auto_1fr_auto_auto] sm:items-start"
                onClick={() => setOpenDay((currentDay) => currentDay === item.day ? 0 : item.day)}
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#0B1D34] text-sm font-semibold text-white">
                  {item.day}
                </span>
                <span>
                  <span className="block font-semibold text-slate-950">{item.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-600">{item.description}</span>
                </span>
                <Badge className="w-fit bg-white text-[#0B1D34] ring-1 ring-slate-200">{item.pace}</Badge>
                <ChevronDown className={`size-5 text-slate-500 transition ${openDay === item.day ? "rotate-180" : ""}`} />
              </button>
              {openDay === item.day ? (
                <div className="grid gap-3 border-t border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-950">Concrete activities for this day</p>
                  <div className="grid gap-3 lg:grid-cols-3">
                    {getDayActivities(destination, item).map((activity) => (
                      <div key={activity.title} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div>
                          <h4 className="font-semibold text-slate-950">{activity.title}</h4>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{activity.description}</p>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{activity.duration}</span>
                          {activityHref ? (
                            <Button asChild size="sm" className="rounded-lg bg-orange-500 text-white hover:bg-orange-600">
                              <TrackedLink
                                href={buildSpecificActivityHref({
                                  activityTitle: activity.title,
                                  destinationLabel,
                                  fallbackHref: activityHref,
                                  slug: destination.slug,
                                })}
                                eventName="affiliate_link_clicked"
                                eventProperties={{
                                  affiliateType: "Activities",
                                  ctaLocation: "day_by_day_itinerary",
                                  destinationName: destinationLabel,
                                  destinationSlug: destination.slug,
                                  href: buildSpecificActivityHref({
                                    activityTitle: activity.title,
                                    destinationLabel,
                                    fallbackHref: activityHref,
                                    slug: destination.slug,
                                  }),
                                  label: activity.title,
                                  linkType: "activity",
                                  page: `/destinations/${destination.slug}`,
                                  title: activity.title,
                                }}
                                rel="sponsored noopener noreferrer"
                                target="_blank"
                              >
                                Reserve
                                <ExternalLink className="ml-1 size-3" />
                              </TrackedLink>
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
        <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <MapPinned className="mt-0.5 size-5 shrink-0 text-[#0B1D34]" />
          <p className="text-sm leading-6 text-slate-600">
            Budget note: add the most expensive paid experience near the middle of the trip, then keep the final day
            flexible for weather, fatigue, or departure timing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function getDayActivities(destination: DayByDayItineraryDestination, dayPlan: ItineraryDay): DayActivity[] {
  if (destination.slug === "mexico-city") {
    return getMexicoCityActivities(dayPlan);
  }

  return getGenericActivities(destination, dayPlan);
}

function getMexicoCityActivities(dayPlan: ItineraryDay): DayActivity[] {
  const text = `${dayPlan.title} ${dayPlan.description}`.toLowerCase();

  if (text.includes("historic") || text.includes("zocalo") || text.includes("murals")) {
    return [
      activity("Historic Center walking tour", "Zocalo, Templo Mayor area, Bellas Artes, murals, and context from a local guide.", "3-4 hours"),
      activity("Palacio de Bellas Artes entry plan", "Use a ticketed or guided museum slot to make the mural-heavy part of the day easier.", "1-2 hours"),
      activity("Rooftop and cantina evening", "Book a food or evening walk that finishes near the historic center.", "2-3 hours"),
    ];
  }

  if (text.includes("chapultepec") || text.includes("anthropology")) {
    return [
      activity("Anthropology Museum guided visit", "A guided museum visit helps prioritize the major rooms instead of losing the full day inside.", "2-3 hours"),
      activity("Chapultepec Castle ticket", "Add the castle for city views, history, and a clean anchor before dinner.", "1-2 hours"),
      activity("Polanco food or gallery walk", "Use the late afternoon for a polished food, art, or neighborhood experience.", "2-3 hours"),
    ];
  }

  if (text.includes("coyoacan") || text.includes("frida")) {
    return [
      activity("Frida Kahlo Museum ticket", "Reserve ahead for the Casa Azul and build the rest of Coyoacan around that time slot.", "1-2 hours"),
      activity("Coyoacan market food stop", "Add tostadas, churros, coffee, and local snacks around the central market.", "1-2 hours"),
      activity("San Angel guided walk", "Pair Coyoacan with San Angel plazas, galleries, and quieter streets.", "2-3 hours"),
    ];
  }

  if (text.includes("teotihuacan") || text.includes("pyramids") || text.includes("balloon")) {
    return [
      activity("Teotihuacan guided day trip", "Transport, site context, and pyramid logistics in one paid activity.", "6-8 hours"),
      activity("Hot air balloon upgrade", "Higher-cost sunrise option for travelers who want the signature splurge.", "4-6 hours"),
      activity("Pyramids plus tasting stop", "Combine the ruins with obsidian, pulque, mezcal, or local lunch stops.", "7-9 hours"),
    ];
  }

  if (text.includes("xochimilco") || text.includes("unam") || text.includes("canals")) {
    return [
      activity("Xochimilco trajinera ride", "Reserve a boat experience and avoid negotiating from scratch on arrival.", "2-3 hours"),
      activity("UNAM murals and campus visit", "Add architecture and murals for a culture-focused south-side day.", "1-2 hours"),
      activity("Xochimilco and Coyoacan combo", "Book a combined south-city route if you want transport handled.", "5-7 hours"),
    ];
  }

  if (text.includes("puebla") || text.includes("taxco")) {
    return [
      activity("Puebla day trip", "Colonial architecture, mole, churches, and regional food in one long day.", "8-10 hours"),
      activity("Taxco silver town tour", "A scenic crafts-focused side trip with hills, viewpoints, and silver shops.", "9-11 hours"),
      activity("Cholula and Puebla combo", "Add Cholula pyramid views and Puebla food stops if you want a fuller itinerary.", "9-11 hours"),
    ];
  }

  if (text.includes("lucha") || text.includes("nightlife")) {
    return [
      activity("Lucha libre night", "A simple, memorable evening activity with ticketing and local context handled.", "2-3 hours"),
      activity("Mezcal tasting", "Book a guided tasting to compare regions and styles without guessing from a menu.", "1-2 hours"),
      activity("Evening taco crawl", "A guided food crawl works well when you want a structured night out.", "3 hours"),
    ];
  }

  if (text.includes("food") || text.includes("roma") || text.includes("condesa") || text.includes("markets")) {
    return [
      activity("Roma and Condesa food tour", "Street food, bakeries, markets, and neighborhood context in one route.", "3-4 hours"),
      activity("Cooking class with market visit", "Turn a flexible food day into a bookable experience with hands-on value.", "4-5 hours"),
      activity("Coffee and design walk", "A lower-pressure route through cafes, boutiques, parks, and local stops.", "2-3 hours"),
    ];
  }

  return [
    activity("Neighborhood orientation walk", "Get settled with a guided route, food stop, and practical local context.", "2-3 hours"),
    activity("Street food sampler", "Book a simple food experience to make the first day feel useful without overplanning.", "2-3 hours"),
    activity("Flexible museum or market ticket", "Keep one bookable activity ready if weather or arrival timing changes.", "1-2 hours"),
  ];
}

function getGenericActivities(destination: DayByDayItineraryDestination, dayPlan: ItineraryDay): DayActivity[] {
  const title = dayPlan.title.toLowerCase();
  const destinationName = destination.cityName ?? destination.name;

  if (title.includes("madrid")) {
    return [
      activity("Prado Museum ticket or guided visit", "Reserve a museum slot and focus the day around the major works instead of waiting in line.", "2-3 hours"),
      activity("Madrid food market tour", "Use San Miguel, tapas stops, or a neighborhood food walk as the day's food anchor.", "3 hours"),
      activity("Toledo or Segovia day trip", "Turn the day-trip part into a booked excursion with transport handled.", "7-10 hours"),
    ];
  }

  if (title.includes("day trip") || title.includes("excursion")) {
    return [
      activity(`${destinationName} guided day trip`, "Book the main side trip with transport, timing, and local context handled.", "6-9 hours"),
      activity("Small-group scenic route", "Use a smaller group option if the destination involves nature, viewpoints, or regional stops.", "5-8 hours"),
      activity("Private transfer activity", "Best when public transport would eat too much of the day.", "4-8 hours"),
    ];
  }

  if (title.includes("museum") || title.includes("culture") || title.includes("historic")) {
    return [
      activity(`${destinationName} museum ticket`, "Reserve the main museum or cultural site for a clear anchor in the day.", "1-3 hours"),
      activity("Historic center walking tour", "Add context, orientation, and practical routes through the main sights.", "2-4 hours"),
      activity("Skip-the-line landmark visit", "Useful when the destination has a major paid attraction or timed entry.", "1-2 hours"),
    ];
  }

  if (title.includes("food") || title.includes("market")) {
    return [
      activity(`${destinationName} food tour`, "Book a guided food route to turn meals into the main activity.", "3-4 hours"),
      activity("Cooking class", "Good for travelers who want one memorable paid experience without adding a day trip.", "3-5 hours"),
      activity("Market tasting walk", "Lower-commitment activity for snacks, local vendors, and neighborhood discovery.", "2-3 hours"),
    ];
  }

  return [
    activity(`${destinationName} highlights tour`, "A practical overview activity that fits the theme of this itinerary day.", "2-4 hours"),
    activity("Local experience or workshop", "Add one concrete bookable activity instead of leaving the whole day vague.", "2-3 hours"),
    activity("Evening food or viewpoint tour", "A useful option when daytime plans stay flexible.", "2-3 hours"),
  ];
}

function activity(title: string, description: string, duration: string): DayActivity {
  return { title, description, duration };
}

function buildSpecificActivityHref({
  activityTitle,
  destinationLabel,
  fallbackHref,
  slug,
}: {
  activityTitle: string;
  destinationLabel: string;
  fallbackHref: string;
  slug: string;
}) {
  const preciseTarget = new URL("https://www.getyourguide.com/s/");

  preciseTarget.searchParams.set("q", `${activityTitle} ${destinationLabel}`);
  preciseTarget.searchParams.set("utm_source", "gobybudget.com");
  preciseTarget.searchParams.set("utm_medium", "affiliate");
  preciseTarget.searchParams.set("partner_id", "4ZWE6DU");

  const encodedUrl = encodeBase64Url(preciseTarget.toString());

  if (!encodedUrl) {
    return fallbackHref;
  }

  const params = new URLSearchParams({
    url: encodedUrl,
    source: "day_by_day_itinerary",
    partner: "GetYourGuide",
    provider: "GetYourGuide",
  });

  return `/go/${slug}/activities?${params.toString()}`;
}

function encodeBase64Url(value: string) {
  try {
    const bytes = new TextEncoder().encode(value);
    let binary = "";

    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });

    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  } catch {
    return "";
  }
}

function day(title: string, description: string, pace: string): Omit<ItineraryDay, "day"> {
  return { title, description, pace };
}

function ItineraryStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white p-3 ring-1 ring-[#14B8A6]/20">
      <Icon className="size-5 shrink-0 text-[#0B1D34]" />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="truncate font-semibold text-slate-950">{value}</p>
      </div>
    </div>
  );
}

function getItineraryPlans(destination: DayByDayItineraryDestination): Record<ItineraryLength, ItineraryDay[]> {
  if (destination.slug === "mexico-city") {
    return normalizePlanDays(mexicoCityPlans);
  }

  return normalizePlanDays({
    7: buildGenericPlan(destination, 7),
    10: buildGenericPlan(destination, 10),
    12: buildGenericPlan(destination, 12),
  });
}

function normalizePlanDays(plans: Record<ItineraryLength, Omit<ItineraryDay, "day">[] | ItineraryDay[]>): Record<ItineraryLength, ItineraryDay[]> {
  return {
    7: plans[7].map((item, index) => ({ ...item, day: index + 1 })),
    10: plans[10].map((item, index) => ({ ...item, day: index + 1 })),
    12: plans[12].map((item, index) => ({ ...item, day: index + 1 })),
  };
}

function buildGenericPlan(destination: DayByDayItineraryDestination, length: ItineraryLength): Omit<ItineraryDay, "day">[] {
  const preview = destination.itineraryPreview.length > 0
    ? destination.itineraryPreview
    : [`Explore ${destination.name}`, `Add a paid activity`, `Keep a flexible local day`];
  const plan: Omit<ItineraryDay, "day">[] = [
    day(`Arrive in ${destination.name}`, "Check in, get oriented, and keep the first evening close to your stay.", "Easy"),
    day(preview[0] ?? `${destination.name} highlights`, "Start with the core neighborhoods, food stops, and first major sights.", "Full"),
    day(preview[1] ?? "Culture and local experiences", "Use this day for museums, markets, guided walks, or signature local activities.", "Moderate"),
    day("Flexible paid activity day", "Put the main tour, day trip, or higher-cost experience here so it anchors the budget clearly.", "Full"),
    day(preview[2] ?? "Scenic or slower local day", "Balance the itinerary with parks, viewpoints, beaches, cafes, or a lower-cost route.", "Moderate"),
    day("Buffer and local favorites", "Leave room for weather, travel fatigue, shopping, or a food-focused day.", "Easy"),
    day("Departure day", "Keep logistics simple with final breakfast, checkout, and airport or station buffer.", "Easy"),
  ];

  if (length >= 10) {
    plan.splice(
      5,
      0,
      day("Second neighborhood base", "Explore a different area to avoid making the trip feel like one long checklist.", "Easy"),
      day("Optional day trip", "Add a nearby city, nature route, beach, or wine/culture excursion if it fits the budget.", "Full"),
      day("Food and evening plan", "Reserve a stronger dinner, night market, show, or guided evening activity.", "Moderate")
    );
  }

  if (length >= 12) {
    plan.splice(
      8,
      0,
      day("Rest and laundry buffer", "Protect the trip from feeling overpacked with a slower day and practical errands.", "Easy"),
      day("Final highlight", "Use the last major activity slot for anything missed earlier or one higher-value guided experience.", "Full")
    );
  }

  return plan.slice(0, length);
}

function getPaceLabel(plan: ItineraryDay[]) {
  const fullDays = plan.filter((item) => item.pace === "Full").length;

  if (fullDays >= plan.length / 2) {
    return "Active";
  }

  if (fullDays >= 3) {
    return "Balanced";
  }

  return "Relaxed";
}
