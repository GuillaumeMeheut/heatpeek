import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { handleSignOut } from "@/lib/auth-helpers/server";

export function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <input
        type="hidden"
        name="pathName"
        value={typeof window !== "undefined" ? window.location.pathname : "/"}
      />
      <Button
        variant="ghost"
        size="sm"
        type="submit"
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </form>
  );
}
