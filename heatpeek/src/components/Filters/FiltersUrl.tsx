"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Url } from "@/lib/supabase/queries";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Plus, Settings } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@locales/client";
import { Separator } from "../ui/separator";

export function FiltersUrl({
  urls,
  projectId,
}: {
  urls: Url[] | null;
  projectId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url");
  const [selectedUrl, setSelectedUrl] = useState(urlParam || "all");
  const t = useI18n();

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
        <SelectTrigger className="w-[170px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <div className="px-2 p-2 grid grid-cols-2 gap-2 w-full">
            <Button size={"sm"} variant={"outline"}>
              <Plus className="w-4 h-4 " />
              {t("filters.new")}
            </Button>
            <Link href={`/${projectId}/manage-urls`}>
              <Button size={"sm"} variant={"outline"}>
                <Settings className="w-4 h-4 " />
                {t("filters.manage")}
              </Button>
            </Link>
          </div>
          <div className="px-2 ">
            <Input placeholder={t("filters.searchPages")} />
          </div>
          <Separator className="my-2" />
          <SelectItem value={"all"}>{t("filters.allPages")}</SelectItem>
          <Separator className="my-2" />
          {urls?.map((url) => (
            <SelectItem key={url.id} value={url.path}>
              {url.label || url.path}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
