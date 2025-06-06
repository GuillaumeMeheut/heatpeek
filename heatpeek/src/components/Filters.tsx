import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Select } from "@/components/ui/select";
import { Download, Filter } from "lucide-react";

export function Filters() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select defaultValue="1d">
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Select defaultValue="/homepage">
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <Input placeholder="Search pages..." className="mb-2" />
            </div>
            <SelectItem value="add-new">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-primary rounded flex items-center justify-center text-xs text-white">
                  +
                </span>
                Add new page
              </div>
            </SelectItem>
            <SelectItem value="/homepage">Homepage</SelectItem>
            <SelectItem value="/product">Product Page</SelectItem>
            <SelectItem value="/pricing">Pricing Page</SelectItem>
            <SelectItem value="/about">About Page</SelectItem>
            <SelectItem value="/contact">Contact Page</SelectItem>
            <SelectItem value="/blog">Blog</SelectItem>
            <SelectItem value="/features">Features</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="ml-auto">
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
