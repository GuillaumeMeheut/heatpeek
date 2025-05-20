import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogIn, LayoutDashboard, UserPlus } from "lucide-react";
import { getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/Auth/sign-auth-button";
import { getI18n } from "../../locales/server";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function Navbar() {
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  const t = await getI18n();

  return (
    <nav className="w-full border-b">
      <div className="w-full flex h-16 items-center justify-evenly">
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
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/why"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("nav.why")}
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("nav.pricing")}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {!!user ? (
            <>
              <Button size="sm" asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  {t("nav.dashboard")}
                </Link>
              </Button>
              <SignOutButton />
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/signin" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  {t("nav.signIn")}
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  {t("nav.signUp")}
                </Link>
              </Button>
            </>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
