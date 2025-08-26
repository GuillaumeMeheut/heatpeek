"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DataItem {
  label: string;
  views: number;
}

interface Category {
  label: string;
  columnName: string;
}

interface ChartBarCustomProps {
  categories: Category[];
  data: DataItem[];
}

export function ChartBarCustom({ categories, data }: ChartBarCustomProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categories[0]
  );

  const handleTabChange = (value: string) => {
    const category = categories.find((cat) => cat.columnName === value);
    if (category) {
      setSelectedCategory(category);
    }
  };

  const handleShowDetails = () => {
    console.log("show details");
  };

  // Limit to top 10 items and calculate percentages
  const limitedData = data.slice(0, 10);
  const totalViews = limitedData.reduce((sum, item) => sum + item.views, 0);

  const dataWithPercentages = limitedData.map((item) => ({
    ...item,
    percentage:
      totalViews > 0 ? ((item.views / totalViews) * 100).toFixed(1) : "0",
    barWidth: totalViews > 0 ? (item.views / totalViews) * 100 : 0,
  }));

  return (
    <Card className="md:col-span-4 lg:col-span-4 ">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{selectedCategory.label}</CardTitle>
            <CardDescription>
              Top {selectedCategory.label.toLowerCase()}
            </CardDescription>
          </div>
          <Tabs
            value={selectedCategory.columnName}
            onValueChange={handleTabChange}
            className="w-auto"
          >
            <TabsList
              className="grid w-full"
              style={{
                gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))`,
              }}
            >
              {categories.map((category) => (
                <TabsTrigger
                  key={category.columnName}
                  value={category.columnName}
                  className="text-xs"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="min-h-fit space-y-2">
        {dataWithPercentages.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-full bg-primary/20 rounded-sm h-8 relative overflow-hidden">
                <div
                  className="bg-primary h-full rounded-sm transition-all duration-300 ease-out flex items-center"
                  style={{ width: `${item.barWidth}%` }}
                >
                  <span className="text-[#353839] text-sm font-medium px-3 whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-3 text-sm">
              <span className="font-medium text-foreground min-w-0">
                {item.views.toLocaleString()}
              </span>
              <span className="text-muted-foreground text-xs min-w-[2.5rem] text-right">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="ghost" size="sm" onClick={handleShowDetails}>
          Show more
        </Button>
      </CardFooter>
    </Card>
  );
}
