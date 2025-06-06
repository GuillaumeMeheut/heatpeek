"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { Project } from "@/lib/supabase/queries";
import { usePathname } from "next/navigation";

interface ProjectListProps {
  projects: Project[];
  currentProject: Project | undefined;
}

export function ProjectList({ projects, currentProject }: ProjectListProps) {
  const pathname = usePathname();

  if (!currentProject || projects.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {currentProject && (
            <span className="truncate">
              {currentProject.label ||
                new URL(currentProject.base_url).hostname}
            </span>
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
                  title={project.label || new URL(project.base_url).hostname}
                >
                  {project.label || new URL(project.base_url).hostname}
                </Link>
              </DropdownMenuItem>
            );
          })}
        {projects.length > 0 && <DropdownMenuSeparator />}
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/add-site" className="flex items-center w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add a new site
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
