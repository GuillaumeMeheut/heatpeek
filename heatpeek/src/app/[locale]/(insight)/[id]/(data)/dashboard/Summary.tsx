import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointer, PieChart, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function Summary() {
  return (
    <Card className="col-span-1 h-fit">
      <CardHeader className="bg-muted/50">
        <CardTitle>Analytics Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Device Breakdown</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-primary">68%</span> Desktop
            </div>
          </div>
          <Progress value={68} className="h-2 bg-muted" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Avg. Click Depth</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-primary">3.2</span> clicks
            </div>
          </div>
          <Progress value={64} className="h-2 bg-muted" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Return Rate</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-primary">42%</span> users
            </div>
          </div>
          <Progress value={42} className="h-2 bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}
