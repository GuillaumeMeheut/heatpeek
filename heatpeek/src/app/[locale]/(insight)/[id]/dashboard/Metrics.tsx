import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  Eye,
  MousePointer,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

export function Metrics() {
  const metrics = [
    {
      title: "Total Sessions",
      value: "12,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Page Views",
      value: "45,231",
      change: "+8.2%",
      trend: "up",
      icon: Eye,
    },
    {
      title: "Click Rate",
      value: "3.4%",
      change: "-0.8%",
      trend: "down",
      icon: MousePointer,
    },
    {
      title: "Avg. Session Duration",
      value: "4m 32s",
      change: "+15.3%",
      trend: "up",
      icon: CalendarDays,
    },
  ];
  return (
    <>
      {metrics.map((metric) => (
        <Card key={metric.title} className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {metric.trend === "up" ? (
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
              )}
              <span
                className={
                  metric.trend === "up" ? "text-green-500" : "text-red-500"
                }
              >
                {metric.change}
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
