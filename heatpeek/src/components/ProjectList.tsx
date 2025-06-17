"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Settings } from "lucide-react";
import Link from "next/link";
import { Project } from "@/lib/supabase/queries";
import { usePathname } from "next/navigation";
import { useI18n } from "@locales/client";

interface ProjectListProps {
  projects: Project[];
  currentProject: Project | undefined;
}

export function ProjectList({ projects, currentProject }: ProjectListProps) {
  const t = useI18n();
  const pathname = usePathname();

  if (!currentProject || projects.length === 0) return null;

  function getProjectLabel(project: Project) {
    if (project.label) {
      return project.label + " (" + new URL(project.base_url).hostname + ")";
    }
    const url = new URL(project.base_url);
    return url.hostname;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {currentProject && (
            <span className="truncate">{getProjectLabel(currentProject)}</span>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {projects.length > 0 &&
          projects.map((project) => {
            const segments = pathname.split("/");
            segments[1] = project.id;
            const newPath = segments.join("/");

            return (
              <DropdownMenuItem key={project.id} className="cursor-pointer">
                <Link
                  href={newPath}
                  className="w-full truncate"
                  title={getProjectLabel(project)}
                >
                  {getProjectLabel(project)}
                </Link>
              </DropdownMenuItem>
            );
          })}
        {projects.length > 0 && <DropdownMenuSeparator />}
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/manage-sites" className="flex items-center w-full">
            <Settings className="h-4 w-4 mr-2" />
            {t("urlList.manageSites")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
