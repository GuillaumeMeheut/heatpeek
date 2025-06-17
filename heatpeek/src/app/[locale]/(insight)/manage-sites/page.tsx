import { createClient } from "@/lib/supabase/server";
import { getProjects, getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import Header from "./Header";
import ProjectsList from "./ProjectsList";

export default async function PageList() {
  const supabase = await createClient();
  const { user } = await getUser(supabase);

  if (!user) redirect("/signin");

  const projects = await getProjects(supabase, user.id);

  if (!projects || projects.length === 0) redirect("/add-site");

  return (
    <div className="space-y-6">
      <Header />
      <ProjectsList projects={projects} />
    </div>
  );
}
