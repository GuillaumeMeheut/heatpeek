"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { UrlList } from "@/components/url-list";
import { SnapshotUrl } from "@/lib/supabase/queries";

export function Sidebar({ snapshotsUrls }: { snapshotsUrls: SnapshotUrl[] }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  return (
    <div
      className={`relative top-0 left-0 h-screen p-4 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-12"
      } border-r bg-primary/5 `}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full border bg-background"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      {isSidebarOpen && (
        <div className="relative space-y-4">
          <Button asChild>
            <Link href="/add-page" className="flex items-center gap-2 w-full">
              <Plus className="h-4 w-4" />
              New Page
            </Link>
          </Button>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="w-full pl-8"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      <UrlList isVisible={isSidebarOpen} snapshotsUrls={snapshotsUrls} />
    </div>
  );
}
