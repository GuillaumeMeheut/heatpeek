"use client";

import { Pie, PieChart, Legend } from "recharts";

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
import { FilterBrowserEnum } from "../Filters/types";

export const description = "Top browsers by views";

const chartConfig = {
  count: {
    label: "Visitors",
  },
  [FilterBrowserEnum.Chrome]: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  [FilterBrowserEnum.Safari]: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  [FilterBrowserEnum.Firefox]: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  [FilterBrowserEnum.Edge]: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  [FilterBrowserEnum.Other]: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function ChartPieLabelCustom({
  data,
}: {
  data: { browser: string; count: number }[];
}) {
  const dataWithColors = data.map((item) => ({
    ...item,
    fill: (
      chartConfig[item.browser as FilterBrowserEnum] as {
        color?: string;
      }
    )?.color,
  }));

  return (
    <Card className="flex flex-col lg:col-span-3">
      <CardHeader className="items-center pb-0">
        <CardTitle>Browsers</CardTitle>
        <CardDescription>Top browsers by views</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] px-0"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="count" hideLabel />}
            />
            <Pie
              data={dataWithColors}
              dataKey="count"
              nameKey="browser"
              labelLine={false}
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                  >
                    {payload.count}
                  </text>
                );
              }}
            />
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
