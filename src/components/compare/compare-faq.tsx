import type { FAQItem } from "@/lib/seo/schema";

export const compareFaqs: FAQItem[] = [
  {
    question: "How do I compare the cost of two trips?",
    answer:
      "Choose two destinations, your departure city, trip length, travelers, travel month, style, and currency. GoByBudget estimates total trip cost from your origin instead of only comparing daily local costs.",
  },
  {
    question: "Does the comparison include flights?",
    answer:
      "Yes. Flight estimates are included as fixed round-trip costs per traveler. Daily categories such as accommodation, food, local transportation, activities, and buffer are multiplied by trip length.",
  },
  {
    question: "How accurate are the travel cost estimates?",
    answer:
      "The numbers are planning estimates based on the destination data available in GoByBudget. They are not live prices and can change with dates, exchange rates, availability, baggage, hotel level, and booking timing.",
  },
  {
    question: "Can I compare trips from Montreal, Toronto or Vancouver?",
    answer:
      "Yes. The comparison supports Montreal, Toronto, Vancouver, and several additional North American origin cities where the current dataset has planning baselines or fallbacks.",
  },
  {
    question: "Are hotel and flight prices live?",
    answer:
      "No. GoByBudget shows planning estimates. Use the flight and hotel links to verify live booking prices before making a purchase.",
  },
  {
    question: "How does trip length affect the estimate?",
    answer:
      "Flights are counted once per traveler for the trip. Accommodation, food, local transportation, activities, and buffer scale with the number of days and travelers.",
  },
  {
    question: "Can I compare destinations in CAD, USD, GBP or EUR?",
    answer:
      "Yes. Destination estimates are modeled in CAD and converted for display into CAD, USD, GBP, or EUR using planning conversion rates.",
  },
  {
    question: "What is included in the total trip cost?",
    answer:
      "The total includes round-trip flights, accommodation, food, local transportation, activities, and an extras or safety buffer where destination data is available.",
  },
];

export function CompareFaq() {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Compare travel costs FAQ</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {compareFaqs.map((faq) => (
          <div key={faq.question} className="rounded-2xl bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-950">{faq.question}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
