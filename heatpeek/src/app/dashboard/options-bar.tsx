"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  MousePointerClick,
  Mouse,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  LucideIcon,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface TooltipButtonProps {
  icon: LucideIcon;
  tooltip: string;
}

function TooltipButton({ icon: Icon, tooltip }: TooltipButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="hover:bg-primary-foreground/90"
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function OptionsBar() {
  return (
    <TooltipProvider>
      <div className="fixed left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-4 px-4 py-3 bg-primary/95 backdrop-blur-sm rounded-full shadow-lg z-30">
        <div className="flex gap-2">
          <TooltipButton
            icon={MousePointerClick}
            tooltip="Analyze user click patterns"
          />
          <TooltipButton icon={Mouse} tooltip="Track user scroll" />
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex gap-2">
          <TooltipButton icon={Smartphone} tooltip="Mobile view" />
          <TooltipButton icon={Tablet} tooltip="Tablet view" />
          <TooltipButton icon={Monitor} tooltip="Desktop view" />
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-2 w-32">
          <Tooltip>
            <TooltipTrigger asChild>
              <Eye className="h-4 w-4 text-primary-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Adjust overlay opacity</p>
            </TooltipContent>
          </Tooltip>
          <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
        </div>
      </div>
    </TooltipProvider>
  );
}
