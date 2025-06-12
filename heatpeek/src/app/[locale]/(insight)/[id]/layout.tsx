import { Filters } from "@/components/Filters/Filters";

export default async function DashboardLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  return (
    <main className="flex-1 container mx-auto py-6">
      <Filters projectId={id} />
      {children}
    </main>
  );
}
