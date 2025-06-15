import { createClient } from "@/lib/supabase/server";
import { getProjects, getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Globe } from "lucide-react";
import Link from "next/link";
import { getI18n } from "@locales/server";
import { deleteProjectAction } from "./actions";

export default async function PageList() {
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  const t = await getI18n();

  if (!user) redirect("/signin");

  const projects = await getProjects(supabase, user.id);

  if (!projects || projects.length === 0) redirect("/add-site");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("projects.title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-[160px] gap-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="flex flex-col hover:shadow-lg h-full transition-all duration-200 border-2 border-transparent hover:border-primary/20"
          >
            <CardHeader className="pb-2">
              <CardTitle className="truncate text-lg">
                {project.label || new URL(project.base_url).hostname}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground truncate flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {project.base_url}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between mt-auto ">
              {project.type && (
                <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                  {project.type}
                </span>
              )}
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/${project.id}/get-started`}>
                    {t("nav.view")}
                  </Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    await deleteProjectAction(project.id);
                  }}
                >
                  <Button
                    type="submit"
                    size="sm"
                    variant="destructive"
                    title={t("projects.delete")}
                  >
                    {t("projects.delete")}
                  </Button>
                </form>
              </div>
            </CardFooter>
          </Card>
        ))}
        <Link href="/add-site" className="block">
          <Card className="h-full hover:shadow-lg transition-all duration-200 border-2 border-dashed border-primary/20 hover:border-primary/40 cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center h-full text-primary/60 hover:text-primary">
              <Plus className="h-8 w-8 mb-2" />
              <p className="text-lg font-medium">{t("projects.addNew")}</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
