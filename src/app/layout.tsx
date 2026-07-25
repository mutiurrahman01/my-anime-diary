import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://myanimediary.vercel.app"),
  title: {
    default: "Anime Diary",
    template: "%s | Anime Diary",
  },
  description:
    "Track your anime watchlist, diary entries, and favorites in one place.",
  keywords: [
    "anime diary",
    "anime tracker",
    "anime watchlist",
    "anime reviews",
    "anime favorites",
  ],
  authors: [{ name: "Anime Diary" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Anime Diary",
    description:
      "Track your anime watchlist, diary entries, and favorites in one place.",
    url: "https://myanimediary.com",
    siteName: "Anime Diary",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anime Diary",
    description:
      "Track your anime watchlist, diary entries, and favorites in one place.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "My Anime Diary",
        url: "https://myanimediary.com",
      },
      {
        "@type": "Organization",
        name: "My Anime Diary",
        url: "https://myanimediary.com",
        sameAs: ["https://twitter.com/myanimediary"],
      },
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
