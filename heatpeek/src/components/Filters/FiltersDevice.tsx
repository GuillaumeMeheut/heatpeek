"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { DeviceEnum } from "@/app/[locale]/(insight)/[id]/(data)/heatmap/types";
import { FilterDevice } from "./types";

export function FiltersDevice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isDashboard = pathname.includes("/dashboard");

  // Get initial device from URL params
  const deviceParam = searchParams.get("device");
  const initialDevice =
    deviceParam || (isDashboard ? "all" : DeviceEnum.Desktop);

  // State for selected device
  const [selectedDevice, setSelectedDevice] = useState<FilterDevice>(
    initialDevice as FilterDevice
  );

  // Update state when URL params change
  useEffect(() => {
    const deviceParam = searchParams.get("device");
    const device = deviceParam || (isDashboard ? "all" : DeviceEnum.Desktop);
    setSelectedDevice(device as FilterDevice);
  }, [searchParams, isDashboard]);

  const handleDeviceChange = (value: string) => {
    const newDevice = value || (isDashboard ? "all" : DeviceEnum.Desktop);
    setSelectedDevice(newDevice as FilterDevice);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (newDevice && newDevice !== "all") {
      params.set("device", newDevice);
    } else {
      params.delete("device");
    }
    router.replace(`?${params.toString()}`);
  };

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={selectedDevice}
      onValueChange={handleDeviceChange}
    >
      {isDashboard && <ToggleGroupItem value={"all"}>All</ToggleGroupItem>}
      <ToggleGroupItem value={DeviceEnum.Desktop}>
        <Monitor className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value={DeviceEnum.Tablet}>
        <Tablet className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value={DeviceEnum.Mobile}>
        <Smartphone className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
