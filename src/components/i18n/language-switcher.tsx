"use client";

import { useState } from "react";
import { Check, Globe2 } from "lucide-react";

import { useTranslation } from "@/components/i18n/language-provider";
import { Button } from "@/components/ui/button";
import { Language, languageLabels, languages } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  function selectLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    setIsOpen(false);
  }

  return (
    <div className="relative hidden sm:block">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={t.nav.changeLanguage}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
        className="rounded-full text-[#434655] hover:text-[#0B1D34]"
      >
        <Globe2 className="size-4" />
      </Button>
      {isOpen ? (
        <div className="absolute right-0 top-11 z-50 w-36 rounded-lg border border-slate-200 bg-white p-1 text-sm shadow-xl shadow-slate-950/10">
          {languages.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => selectLanguage(item)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
            >
              <span>{languageLabels[item]}</span>
              {item === language ? <Check className="size-4 text-[#0B1D34]" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
