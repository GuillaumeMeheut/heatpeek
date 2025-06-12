"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SnapshotInfos } from "@/lib/supabase/queries";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function FiltersUrl({
  snapshots,
}: {
  snapshots: SnapshotInfos[] | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url");
  const [selectedUrl, setSelectedUrl] = useState(urlParam || "all");

  useEffect(() => {
    setSelectedUrl(urlParam || "all");
  }, [urlParam]);

  const handleUrlChange = (value: string) => {
    setSelectedUrl(value);

    // Update the query param
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("url");
    } else {
      params.set("url", value);
    }
    router.replace(`?${params.toString()}`);
  };
  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedUrl}
        onValueChange={handleUrlChange}
        defaultValue={selectedUrl}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <div className="px-2 p-2">
            <Button size={"sm"} variant={"outline"} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add new page
            </Button>
          </div>
          <div className="px-2 pb-2">
            <Input placeholder="Search pages..." className="mb-2" />
          </div>
          <SelectItem value={"all"}>All Pages</SelectItem>
          {snapshots?.map((page) => (
            <SelectItem key={page.id} value={page.url}>
              {page.label || page.url}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
