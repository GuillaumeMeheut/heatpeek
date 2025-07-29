"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@locales/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FilterDateEnum } from "./types";

export function FiltersDate() {
  const t = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial date from URL params
  const dateParam = searchParams.get("date");
  const initialDate = dateParam || FilterDateEnum.Last7Days;

  // State for selected date
  const [selectedDate, setSelectedDate] = useState<FilterDateEnum>(
    initialDate as FilterDateEnum
  );

  // Update state when URL params change
  useEffect(() => {
    const dateParam = searchParams.get("date");
    const date = dateParam || FilterDateEnum.Last7Days;
    setSelectedDate(date as FilterDateEnum);
  }, [searchParams]);

  const handleDateChange = (value: FilterDateEnum) => {
    setSelectedDate(value);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", value);
    router.replace(`?${params.toString()}`);
  };

  return (
    <Select value={selectedDate} onValueChange={handleDateChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={FilterDateEnum.Last24Hours}>
          {t("filters.last24hours")}
        </SelectItem>
        <SelectItem value={FilterDateEnum.Last7Days}>
          {t("filters.last7days")}
        </SelectItem>
        <SelectItem value={FilterDateEnum.Last30Days}>
          {t("filters.last30days")}
        </SelectItem>
        <SelectItem value={FilterDateEnum.Last90Days}>
          {t("filters.last90days")}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
