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
import { useParams } from "next/navigation";

interface ProjectListProps {
  projects: Project[];
  // currentProject: Project;
}

export function ProjectList({ projects }: ProjectListProps) {
  const params = useParams();
  const currentId = params.id as string;
  const currentProject = projects.find((project) => project.id === currentId);
  if (projects.length === 0 || !params.id) {
    return null;
  }
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
          projects.map((project) => (
            <DropdownMenuItem key={project.id} className="cursor-pointer">
              <Link
                href={`/${project.id}/get-started`}
                className="w-full truncate"
                title={project.label || new URL(project.base_url).hostname}
              >
                {project.label || new URL(project.base_url).hostname}
              </Link>
            </DropdownMenuItem>
          ))}
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
