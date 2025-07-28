import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  MousePointer,
  Mouse,
  Clock,
} from "lucide-react";

export function Metrics({
  pageViews,
  clicks,
  scrollDepth,
  avgTimeOnPage,
}: {
  pageViews: number;
  clicks: number;
  scrollDepth: number;
  avgTimeOnPage: number;
}) {
  const metrics = [
    {
      title: "Page Views",
      value: pageViews,
      change: "+8.2%",
      trend: "up" as const,
      icon: Eye,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Click Rate",
      value: `${((clicks / pageViews) * 100).toFixed(2) || 0}%`,
      change: "-0.8%",
      trend: "down" as const,
      icon: MousePointer,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Scroll Depth",
      value: `${scrollDepth}%`,
      change: "+5.5%",
      trend: "up" as const,
      icon: Mouse,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Average Time on Page",
      value: `${avgTimeOnPage}s`,
      change: "+15.3%",
      trend: "up" as const,
      icon: Clock,
      color: "from-purple-500 to-pink-500",
    },
  ];
  return (
    <>
      {metrics.map((metric) => (
        <Card
          key={metric.title}
          className="relative overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm lg:col-span-2"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5`}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardTitle>
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}
            >
              <metric.icon className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {metric.value}
            </div>
            <div className="flex items-center text-sm">
              {metric.trend === "up" ? (
                <ArrowUpRight className="w-4 h-4 mr-1 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1 text-red-500" />
              )}
              <span
                className={
                  metric.trend === "up"
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {metric.change}
              </span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
