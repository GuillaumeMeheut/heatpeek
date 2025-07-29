import { DeviceEnum } from "@/app/[locale]/(insight)/[id]/(data)/heatmap/types";

export type FilterDevice = DeviceEnum | undefined;

export enum FilterDateEnum {
  Last24Hours = "1d",
  Last7Days = "7d",
  Last30Days = "30d",
  Last90Days = "90d",
}
