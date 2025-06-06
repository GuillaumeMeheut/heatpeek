import Link from "next/link";
import Image from "next/image";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getI18n } from "@locales/server";
import { ProjectList } from "@/components/ProjectList";
import { Project } from "@/lib/supabase/queries";
import type { User } from "@supabase/supabase-js";

export async function InsightNavbar({
  projects,
  user,
}: {
  projects: Project[];
  user: User;
}) {
  const t = await getI18n();

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
          <Link href="/get-started" className="text-sm text-gray-500">
            {t("nav.getStarted")}
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-500">
            {t("nav.dashboard")}
          </Link>
          <Link href="/heatmap" className="text-sm text-gray-500">
            {t("nav.heatmap")}
          </Link>
          <Link href="/elements" className="text-sm text-gray-500">
            {t("nav.elements")}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ProjectList projects={projects || []} />
          <LanguageSwitcher />
          <p>{user.email}</p>
        </div>
      </div>
    </header>
  );
}
