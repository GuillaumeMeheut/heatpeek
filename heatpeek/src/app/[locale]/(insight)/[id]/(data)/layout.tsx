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
    <>
      <Filters projectId={id} />
      {children}
    </>
  );
}
