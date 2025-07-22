import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/globals.css";
import { ReactElement } from "react";
import { I18nProviderClient } from "../../../locales/client";
import { Toaster } from "@/components/ui/Toast/sonner";
import { ToastListener } from "@/components/ui/Toast/ToastListener";
import Script from "next/script";

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
  verification: {
    google: "hsOjJBRlLPdcjorDyYrG7bXlybkfODPMrxehr2Bgqr8",
  },
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
      <Script
        id="ODA9LLqP"
        src="https://cdn.heatpeek.com/hp.js"
        defer
        strategy="afterInteractive"
      />
      <body className={inter.className}>
        <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
        <Toaster theme="light" position="bottom-center" richColors />
        <ToastListener />
      </body>
    </html>
  );
}
