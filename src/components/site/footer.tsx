import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="font-semibold text-blue-600">
            TravelBudget.ai
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
            Budget-first destination discovery for travelers who want clear numbers before they book.
          </p>
        </div>
        {[
          ["Product", "Calculator", "Compare", "Tools"],
          ["Resources", "Guides", "Destinations", "FAQ"],
          ["Legal", "Privacy", "Terms", "Disclosure"],
        ].map(([title, ...links]) => (
          <div key={title}>
            <p className="text-sm font-semibold text-slate-950">{title}</p>
            <div className="mt-3 grid gap-2 text-sm text-slate-500">
              {links.map((link) => (
                <Link key={link} href="/tools" className="hover:text-blue-600">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
