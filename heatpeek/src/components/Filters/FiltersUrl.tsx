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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url");
  const isDashboard = pathname.includes("/dashboard");
  const [selectedUrl, setSelectedUrl] = useState(
    urlParam || (isDashboard ? "all" : undefined)
  );
  const t = useI18n();

  const setUrl = useCallback(
    (url: string | undefined) => {
      setSelectedUrl(url);
      const params = new URLSearchParams(searchParams.toString());
      if (url && url !== "all") {
        params.set("url", url);
      } else {
        params.delete("url");
      }
      router.replace(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  useEffect(() => {
    if (!isDashboard && urls && urls.length > 0 && !urlParam) {
      // If not on dashboard and we have URLs, but no URL param, set to first URL
      const firstUrl = urls[0];
      setUrl(firstUrl.path);
    } else if (!urlParam && urls && urls.length > 0 && !isDashboard) {
      // If no URL is set and we have URLs, set the first one (for non-dashboard pages)
      const firstUrl = urls[0];
      setUrl(firstUrl.path);
    } else {
      setUrl(urlParam || (isDashboard ? "all" : undefined));
    }
  }, [urlParam, urls, isDashboard, setUrl]);

  const handleUrlChange = (value: string) => {
    const newUrl = value === "all" ? "all" : value;
    setSelectedUrl(newUrl);

    // Update the query param
    const params = new URLSearchParams(searchParams.toString());
    if (newUrl && newUrl !== "all") {
      params.set("url", newUrl);
    } else {
      params.delete("url");
    }
    router.replace(`?${params.toString()}`);
  };

  const getUrlLabel = (url: Url) => {
    if (url.label) {
      return `${url.label} (${url.path})`;
    }
    return url.path;
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedUrl || "all"}
        onValueChange={handleUrlChange}
        defaultValue={selectedUrl || "all"}
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
          {isDashboard && (
            <SelectItem value="all">{t("filters.allPages")}</SelectItem>
          )}
          <Separator className="my-2" />
          {urls?.map((url) => (
            <SelectItem key={url.id} value={url.path}>
              {getUrlLabel(url)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
