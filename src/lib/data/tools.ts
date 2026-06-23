import {
  CalendarDays,
  Compass,
  Luggage,
  Map,
  Plane,
  Scale,
  Smartphone,
  WalletCards,
} from "lucide-react";

export const tools = [
  {
    title: "Budget Calculator",
    description: "Estimate flights, stays, food, transport, and activities in seconds.",
    icon: WalletCards,
    href: "/",
  },
  {
    title: "Itinerary Builder",
    description: "Turn a destination and trip length into a practical daily plan.",
    icon: Map,
    href: "/tools",
  },
  {
    title: "Destination Comparator",
    description: "Compare trip totals, weather, and value scores side by side.",
    icon: Scale,
    href: "/compare",
  },
  {
    title: "Price Calendar",
    description: "Spot cheaper travel months before you choose dates.",
    icon: CalendarDays,
    href: "/tools",
  },
  {
    title: "eSIM Finder",
    description: "Find destination-friendly mobile data options for your route.",
    icon: Smartphone,
    href: "/tools",
  },
  {
    title: "Packing List",
    description: "Build a packing plan based on destination, season, and style.",
    icon: Luggage,
    href: "/tools",
  },
  {
    title: "Flight Watch",
    description: "Mock alerts for routes where airfare drives most of the budget.",
    icon: Plane,
    href: "/results",
  },
  {
    title: "Style Matcher",
    description: "Discover destinations that fit your pace, comfort, and priorities.",
    icon: Compass,
    href: "/tools",
  },
];
