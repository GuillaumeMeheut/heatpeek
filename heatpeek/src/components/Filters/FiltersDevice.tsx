"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { FilterDevice } from "./types";

export function FiltersDevice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isDashboard = pathname.includes("/dashboard");

  // Get initial device from URL params
  const deviceParam = searchParams.get("device");
  const initialDevice = deviceParam || (isDashboard ? "all" : "desktop");

  // State for selected device
  const [selectedDevice, setSelectedDevice] = useState<FilterDevice>(
    initialDevice as FilterDevice
  );

  // Update state when URL params change
  useEffect(() => {
    const deviceParam = searchParams.get("device");
    const device = deviceParam || (isDashboard ? "all" : "desktop");
    setSelectedDevice(device as FilterDevice);
  }, [searchParams, isDashboard]);

  const handleDeviceChange = (value: FilterDevice) => {
    const newDevice = value || (isDashboard ? "all" : "desktop");
    setSelectedDevice(newDevice);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("device", newDevice);
    router.replace(`?${params.toString()}`);
  };

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={selectedDevice}
      onValueChange={handleDeviceChange}
    >
      {isDashboard && <ToggleGroupItem value="all">All</ToggleGroupItem>}
      <ToggleGroupItem value="desktop">
        <Monitor className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="tablet">
        <Tablet className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="mobile">
        <Smartphone className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
