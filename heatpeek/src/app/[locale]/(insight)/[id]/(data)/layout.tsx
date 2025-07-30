import { Filters } from "@/components/Filters/Filters";

export default async function DashboardLayout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const { id } = params;
  return (
    <>
      <Filters projectId={id} />
      {children}
    </>
  );
}
