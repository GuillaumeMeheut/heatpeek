import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, LayoutDashboard, UserPlus } from "lucide-react";

export async function Navbar() {
  const connected = true;
  return (
    <nav className="w-full border-b">
      <div className=" w-full flex h-16 items-center justify-evenly">
        <Link href="/" className="font-bold text-xl">
          Heatpeek
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/why"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Why Heatpeek ?
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {connected ? (
            <Button size="sm" asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/signin" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
