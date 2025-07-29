"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { FilterDateEnum } from "../Filters/types";

const chartConfig = {
  pageViews: {
    label: "Page Views",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartLineDefault({
  dateRange,
  data,
}: {
  dateRange: string;
  data: { date: string; pageViews: number }[];
}) {
  const tickFormatter = (value: string) => {
    const date = new Date(value);
    if (dateRange === FilterDateEnum.Last24Hours)
      return date.getHours() + ":00";
    if (
      dateRange === FilterDateEnum.Last7Days ||
      dateRange === FilterDateEnum.Last30Days
    )
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    return date.toLocaleDateString("en-US", { month: "short" }); // monthly
  };

  return (
    <Card className="md:col-span-4 lg:col-span-5">
      <CardHeader>
        <CardTitle>Page Views</CardTitle>
        <CardDescription>Page views by date</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[250px] w-full">
          <LineChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={tickFormatter}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="pageViews"
              type="natural"
              stroke="var(--color-pageViews)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
