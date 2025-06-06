import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TopPage() {
  const topPages = [
    { page: "/homepage", views: 15420, clicks: 892, rate: "5.8%" },
    { page: "/product", views: 8934, clicks: 445, rate: "5.0%" },
    { page: "/pricing", views: 6721, clicks: 234, rate: "3.5%" },
    { page: "/about", views: 4532, clicks: 156, rate: "3.4%" },
    { page: "/contact", views: 2891, clicks: 87, rate: "3.0%" },
  ];
  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Top Performing Pages</CardTitle>
            <CardDescription>Pages with highest engagement</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <LineChart className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {topPages.map((page, index) => (
            <div
              key={page.page}
              className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{page.page}</div>
                  <div className="text-sm text-muted-foreground">
                    {page.views.toLocaleString()} views • {page.clicks} clicks
                  </div>
                </div>
              </div>
              <Badge variant="default">{page.rate}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
