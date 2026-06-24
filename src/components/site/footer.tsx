import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#c3c6d7]/35 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="font-semibold text-blue-600">
            TravelBudget.ai
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#434655]">
            Premium AI Financial Travel Planner for the modern explorer. Make your money go further.
          </p>
        </div>
        {[
          ["Products", "Budget Calculator", "Itinerary Builder", "eSIM Finder"],
          ["Company", "About Us", "Careers", "Contact"],
          ["Legal", "Privacy Policy", "Terms of Service"],
        ].map(([title, ...links]) => (
          <div key={title}>
            <p className="text-sm font-semibold text-[#191c1e]">{title}</p>
            <div className="mt-3 grid gap-2 text-sm text-[#434655]">
              {links.map((link) => (
                <Link key={link} href="/tools" className="hover:text-blue-600">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-7xl border-t border-[#c3c6d7]/35 px-4 py-5 text-sm text-[#434655] sm:px-6 lg:px-8">
        © 2026 TravelBudget.ai - Premium AI Financial Travel Planner
      </div>
    </footer>
  );
}
