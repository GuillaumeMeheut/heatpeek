import "../../../styles/globals.css";
import { Navbar } from "@/components/Navbar";
import { ReactElement } from "react";

export default async function RootLayout({
  children,
}: {
  params: Promise<{ locale: string }>;
  children: ReactElement;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
