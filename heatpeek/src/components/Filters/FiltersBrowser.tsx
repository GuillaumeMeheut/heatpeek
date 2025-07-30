"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Chrome, Globe, Flame, Monitor, Square } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { FilterBrowserEnum, FilterBrowser } from "./types";

export function FiltersBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isDashboard = pathname.includes("/dashboard");

  // State for selected browser
  const [selectedBrowser, setSelectedBrowser] =
    useState<FilterBrowser>(undefined);

  // Update state when URL params change
  useEffect(() => {
    const browserParam = searchParams.get("browser");
    const browser = browserParam || "all";
    setSelectedBrowser(browser as FilterBrowser);
  }, [searchParams, isDashboard]);

  const handleBrowserChange = (value: string) => {
    const newBrowser = value || "all";
    setSelectedBrowser(newBrowser as FilterBrowser);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (newBrowser && newBrowser !== "all") {
      params.set("browser", newBrowser);
    } else {
      params.delete("browser");
    }
    router.replace(`?${params.toString()}`);
  };

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={selectedBrowser}
      onValueChange={handleBrowserChange}
    >
      <ToggleGroupItem value={"all"}>All</ToggleGroupItem>
      <ToggleGroupItem value={FilterBrowserEnum.Chrome}>
        <Chrome className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value={FilterBrowserEnum.Safari}>
        <Globe className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value={FilterBrowserEnum.Firefox}>
        <Flame className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value={FilterBrowserEnum.Edge}>
        <Monitor className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value={FilterBrowserEnum.Other}>
        <Square className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
