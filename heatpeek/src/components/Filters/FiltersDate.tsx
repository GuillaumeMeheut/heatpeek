"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@locales/client";

export function FiltersDate() {
  const t = useI18n();
  return (
    <Select defaultValue="1d">
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1d">{t("filters.last24hours")}</SelectItem>
        <SelectItem value="7d">{t("filters.last7days")}</SelectItem>
        <SelectItem value="30d">{t("filters.last30days")}</SelectItem>
        <SelectItem value="90d">{t("filters.last90days")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
