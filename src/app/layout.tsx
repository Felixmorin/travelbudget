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

const travelpayoutDriveScript = `
  (function () {
      var script = document.createElement("script");
      script.async = 1;
      script.src = 'https://emrldco.com/NTQ4MjEz.js?t=548213';
      document.head.appendChild(script);
  })();
`;
const travelpayoutDriveAttributes = {
  nowprocket: "",
  "data-noptimize": "1",
  "data-cfasync": "false",
  "data-wpfc-render": "false",
  "seraph-accel-crit": "1",
  "data-no-defer": "1",
} as Record<string, string>;

const googleAnalyticsScript = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-LL509H3H2L');
`;

const microsoftClarityScript = `
  (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "xjw5swfjdp");
`;

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
      <head>
        {/* eslint-disable-next-line @next/next/next-script-for-ga -- Google requested this exact tag directly after <head>. */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-LL509H3H2L" />
        <script dangerouslySetInnerHTML={{ __html: googleAnalyticsScript }} />
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: microsoftClarityScript }} />
        <script
          {...travelpayoutDriveAttributes}
          dangerouslySetInnerHTML={{ __html: travelpayoutDriveScript }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6743160991638916"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
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
