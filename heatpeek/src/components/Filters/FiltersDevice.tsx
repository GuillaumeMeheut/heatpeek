"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { DeviceEnum } from "@/app/[locale]/(insight)/[id]/(data)/heatmap/types";

export enum FilterDeviceEnum {
  All = "all",
  Desktop = DeviceEnum.Desktop,
  Tablet = DeviceEnum.Tablet,
  Mobile = DeviceEnum.Mobile,
}

export function FiltersDevice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isDashboard = pathname.includes("/dashboard");

  // Get initial device from URL params
  const deviceParam = searchParams.get("device");
  const initialDevice =
    deviceParam ||
    (isDashboard ? FilterDeviceEnum.All : FilterDeviceEnum.Desktop);

  // State for selected device
  const [selectedDevice, setSelectedDevice] = useState<FilterDeviceEnum>(
    initialDevice as FilterDeviceEnum
  );

  // Update state when URL params change
  useEffect(() => {
    const deviceParam = searchParams.get("device");
    const device =
      deviceParam ||
      (isDashboard ? FilterDeviceEnum.All : FilterDeviceEnum.Desktop);
    setSelectedDevice(device as FilterDeviceEnum);
  }, [searchParams, isDashboard]);

  const handleDeviceChange = (value: FilterDeviceEnum) => {
    const newDevice =
      value || (isDashboard ? FilterDeviceEnum.All : FilterDeviceEnum.Desktop);
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
      {isDashboard && (
        <ToggleGroupItem value={FilterDeviceEnum.All}>All</ToggleGroupItem>
      )}
      <ToggleGroupItem value={FilterDeviceEnum.Desktop}>
        <Monitor className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value={FilterDeviceEnum.Tablet}>
        <Tablet className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value={FilterDeviceEnum.Mobile}>
        <Smartphone className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
