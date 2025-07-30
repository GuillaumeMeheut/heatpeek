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

  // Get initial browser from URL params
  const browserParam = searchParams.get("browser");
  const initialBrowser =
    browserParam || (isDashboard ? "all" : FilterBrowserEnum.Chrome);

  // State for selected browser
  const [selectedBrowser, setSelectedBrowser] = useState<FilterBrowser>(
    initialBrowser as FilterBrowser
  );

  // Update state when URL params change
  useEffect(() => {
    const browserParam = searchParams.get("browser");
    const browser =
      browserParam || (isDashboard ? "all" : FilterBrowserEnum.Chrome);
    setSelectedBrowser(browser as FilterBrowser);
  }, [searchParams, isDashboard]);

  const handleBrowserChange = (value: string) => {
    const newBrowser =
      value || (isDashboard ? "all" : FilterBrowserEnum.Chrome);
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
      {isDashboard && <ToggleGroupItem value={"all"}>All</ToggleGroupItem>}
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
