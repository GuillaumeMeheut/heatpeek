import { Filters } from "@/components/Filters";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 container mx-auto py-6">
      <Filters />
      {children}
    </main>
  );
}
