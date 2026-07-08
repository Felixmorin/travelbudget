import Link from "next/link";
import { Info } from "lucide-react";

type EstimateDisclaimerProps = {
  className?: string;
  title?: string;
};

export function EstimateDisclaimer({
  className = "",
  title = "Planning estimate",
}: EstimateDisclaimerProps) {
  return (
    <div
      className={`rounded-2xl border border-[#14B8A6]/20 bg-[#14B8A6]/10 p-4 text-sm leading-6 text-slate-600 ${className}`}
    >
      <div className="flex gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-[#0B1D34] shadow-sm">
          <Info className="size-4" />
        </span>
        <div>
          <p className="font-semibold text-slate-950">{title}</p>
          <p className="mt-1">
            Estimates are for planning only. Actual prices can vary with flights, hotels, availability,
            seasonality, exchange rates, booking timing, departure city, and traveler choices.{" "}
            <Link href="/methodology" className="font-semibold text-[#0B1D34] hover:text-[#0B1D34]">
              See methodology
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
