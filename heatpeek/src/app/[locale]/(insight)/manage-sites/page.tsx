import { createClient } from "@/lib/supabase/server";
import { getProjects, getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import Header from "./Header";
import ProjectsList from "./ProjectsList";
import AddProject from "./AddProject";
import { getI18n } from "@locales/server";

export default async function PageList() {
  const supabase = await createClient();
  const { user } = await getUser(supabase);

  if (!user) redirect("/signin");

  const t = await getI18n();

  const projects = await getProjects(supabase, user.id);

  return (
    <div className="h-full">
      <Header />
      {projects && projects.length > 0 ? (
        <ProjectsList projects={projects} />
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-4 mt-[200px]">
          <p className="text-muted-foreground">{t("projects.emptyState")}</p>
          <AddProject />
        </div>
      )}
    </div>
  );
}
