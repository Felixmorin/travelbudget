import { BadgeCheck, Globe2, ShieldCheck, TrendingUp } from "lucide-react";

const items = [
  { label: "Transparent estimates", icon: BadgeCheck },
  { label: "Budget-first ranking", icon: TrendingUp },
  { label: "Global destination data", icon: Globe2 },
  { label: "No booking pressure", icon: ShieldCheck },
];

export function TrustSection() {
  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                <Icon className="size-5" />
              </span>
              <span className="text-sm font-semibold text-slate-800">{item.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
