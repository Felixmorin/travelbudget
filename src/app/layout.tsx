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

const driveScriptAttributes = {
  nowprocket: "",
  "data-noptimize": "1",
  "data-cfasync": "false",
  "data-wpfc-render": "false",
  "seraph-accel-crit": "1",
  "data-no-defer": "1",
};

export const metadata = createMetadata();

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
      <Script
        id="drive-loader"
        strategy="beforeInteractive"
        {...driveScriptAttributes}
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              var script = document.createElement("script");
              script.async = 1;
              script.src = "https://emrldco.com/NTQ4MjEz.js?t=548213";
              document.head.appendChild(script);
            })();
          `,
        }}
      />
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
    </html>
  );
}
