"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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

export const description = "A bar chart with a custom label";

const chartData = [
  { referrer: "bing.com", views: 305 },
  { referrer: "duckduckgo.com", views: 237 },
  { referrer: "google.com", views: 214 },
  { referrer: "yahoo.com", views: 209 },
  { referrer: "reddit.com", views: 186 },
  { referrer: "youtube.com", views: 73 },
];

// Calculate total views for percentage calculation
const totalViews = chartData.reduce((sum, item) => sum + item.views, 0);

// Add percentage to each data point
const chartDataWithPercentages = chartData.map((item) => ({
  ...item,
  percentage: ((item.views / totalViews) * 100).toFixed(1),
}));

const chartConfig = {
  label: {
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartBarLabelCustom() {
  return (
    <Card className="md:col-span-4 lg:col-span-4">
      <CardHeader>
        <CardTitle>Referrers</CardTitle>
        <CardDescription>Top referrers</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartDataWithPercentages}
            layout="vertical"
            margin={{
              right: 20,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="referrer"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="views" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="views"
              layout="vertical"
              fill="var(--chart-1)"
              radius={4}
            >
              <LabelList
                dataKey="referrer"
                position="insideLeft"
                offset={8}
                className="fill-primary-foreground"
                fontSize={12}
              />
              <LabelList
                dataKey="percentage"
                position="right"
                offset={8}
                className="fill-chart-1"
                fontSize={12}
                formatter={(value: string | number) => `${value}%`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
