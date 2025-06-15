import { InsightNavbar } from "@/components/InsightNavbar";
import { getUser } from "@/lib/supabase/queries";
import { getProjects } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { user } = await getUser(supabase);

  if (!user) redirect("/signin");

  const projects = await getProjects(supabase, user.id);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <InsightNavbar projects={projects || []} user={user} />
      <main className="container mx-auto py-8">{children}</main>
    </div>
  );
}
