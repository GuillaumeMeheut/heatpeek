import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/Toast/toaster";
import { ReactElement, Suspense } from "react";
import { I18nProviderClient } from "../../../locales/client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Heatpeek - Privacy-Focused Heatmap Analytics",
  description:
    "Understand your users without compromising their privacy. Heatpeek provides lightweight, privacy-respecting heatmap analytics for your website.",
  keywords: [
    "heatpeek",
    "heatmap",
    "analytics",
    "privacy",
    "website",
    "analytics",
    "heatmap",
    "analytics",
    "heatmap",
    "analytics",
  ],
};

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: ReactElement;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <I18nProviderClient locale={locale}>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex items-center justify-center">
              {children}
            </main>
          </div>
          <Suspense>
            <Toaster />
          </Suspense>
        </I18nProviderClient>
      </body>
    </html>
  );
}
