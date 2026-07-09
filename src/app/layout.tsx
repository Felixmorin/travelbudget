import { Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { ConsentManagedAnalytics } from "@/components/analytics/consent-managed-analytics";
import { CookieConsentBanner } from "@/components/analytics/cookie-consent-banner";
import { LanguageProvider } from "@/components/i18n/language-provider";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { createMetadata } from "@/lib/seo/metadata";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = createMetadata();

const travelpayoutScriptAttributes: Record<string, string> = {
  nowprocket: "",
  "data-noptimize": "1",
  "data-cfasync": "false",
  "data-wpfc-render": "false",
  "seraph-accel-crit": "1",
  "data-no-defer": "1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AnalyticsScripts />
        <LanguageProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </LanguageProvider>
        <ConsentManagedAnalytics />
        <CookieConsentBanner />
      </body>
      <Script
        id="travelpayout"
        strategy="beforeInteractive"
        {...travelpayoutScriptAttributes}
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              var script = document.createElement("script");
              script.async = true;
              script.src = "https://emrldco.com/NTQ4MTk4.js?t=548198";
              document.head.appendChild(script);
            })();
          `,
        }}
      />
    </html>
  );
}
