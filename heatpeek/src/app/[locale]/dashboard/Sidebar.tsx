"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { UrlList } from "@/components/UrlList";
import { SnapshotInfos } from "@/lib/supabase/queries";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@locales/client";

export function Sidebar({
  snapshotsInfos,
}: {
  snapshotsInfos: SnapshotInfos[];
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const t = useI18n();

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
              {t("sidebar.newPage")}
            </Link>
          </Button>
          <Separator orientation="horizontal" className="w-full my-4" />

          {/* Create a block contains 4 stats with big number total number of clicks */}

          <Separator orientation="horizontal" className="w-full my-4" />

          <UrlList isVisible={isSidebarOpen} snapshotsInfos={snapshotsInfos} />
        </div>
      )}
    </div>
  );
}
