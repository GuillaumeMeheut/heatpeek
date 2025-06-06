"use client";

import Link from "next/link";
import Image from "next/image";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ProjectList } from "@/components/ProjectList";
import { Project } from "@/lib/supabase/queries";
import type { User } from "@supabase/supabase-js";
import { useParams, usePathname } from "next/navigation";
import { useI18n } from "@locales/client";

interface NavLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

function NavLink({ href, isActive, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`text-sm text-gray-500 ${
        isActive ? "text-primary border-b-2 border-primary" : ""
      }`}
    >
      {children}
    </Link>
  );
}

export function InsightNavbar({
  projects,
  user,
}: {
  projects: Project[];
  user: User;
}) {
  const t = useI18n();
  const pathname = usePathname();

  const params = useParams();
  const currentId = params.id as string;
  const currentProject = projects.find((project) => project.id === currentId);

  const isDashboard = pathname.includes("/dashboard");
  const isHeatmap = pathname.includes("/heatmap");
  const isElements = pathname.includes("/elements");
  const isGetStarted = pathname.includes("/get-started");

  return (
    <header className="py-4 border-b">
      <div className="container flex justify-between items-center mx-auto">
        <nav className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Heatpeek Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            Heatpeek
          </Link>
          {currentId && (
            <>
              <NavLink
                href={`/${currentId}/get-started`}
                isActive={isGetStarted}
              >
                {t("nav.getStarted")}
              </NavLink>
              <NavLink href={`/${currentId}/dashboard`} isActive={isDashboard}>
                {t("nav.dashboard")}
              </NavLink>
              <NavLink href={`/${currentId}/heatmap`} isActive={isHeatmap}>
                {t("nav.heatmap")}
              </NavLink>
              <NavLink href={`/${currentId}/elements`} isActive={isElements}>
                {t("nav.elements")}
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <ProjectList
            projects={projects || []}
            currentProject={currentProject}
          />
          <LanguageSwitcher />
          <p>{user.email}</p>
        </div>
      </div>
    </header>
  );
}
