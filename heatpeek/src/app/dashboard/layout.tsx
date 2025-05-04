import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard,
  MousePointerClick,
  Zap,
  Mouse,
  Plus,
} from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CategoryButton } from "@/components/dashboard/category-button";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b bg-primary/5">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Plus className="h-4 w-4" />
              Add Page
            </Button>
            <select className="px-3 py-2 rounded-md border border-input bg-background">
              <option value="https://guillaume-meheut.vercel.app/">
                https://guillaume-meheut.vercel.app/
              </option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="date-range" className="text-primary">
                Date Range
              </Label>
              <DatePicker />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r bg-primary/5">
          <div className="flex flex-col space-y-1 p-4">
            <TooltipProvider>
              <CategoryButton
                icon={MousePointerClick}
                label="Click Analytics"
                description="Analyze user click patterns and interactions"
              />
              <CategoryButton
                icon={Mouse}
                label="Scroll Analytics"
                description="Track how far users scroll on your pages"
              />
              <CategoryButton
                icon={Zap}
                label="Rage Click"
                description="Identify areas where users repeatedly click in frustration"
              />
            </TooltipProvider>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Card className="p-6 border-primary/20">{children}</Card>
        </div>
      </div>
    </div>
  );
}
