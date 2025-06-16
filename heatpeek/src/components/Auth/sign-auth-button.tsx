import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-helpers/server";
import { getI18n } from "@locales/server";

export async function SignOutButton() {
  const t = await getI18n();
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
