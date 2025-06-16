"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-helpers/server";
import { useI18n } from "@locales/client";

export function SignOutButton() {
  const t = useI18n();
  return (
    <form action={signOut}>
      <Button
        variant="ghost"
        size="sm"
        type="submit"
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        {t("auth.signOut")}
      </Button>
    </form>
  );
}
