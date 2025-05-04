import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/Toast/toaster";
import { Suspense } from "react";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
        </div>
        <Suspense>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
