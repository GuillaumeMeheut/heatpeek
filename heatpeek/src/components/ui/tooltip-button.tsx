import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

interface TooltipButtonProps {
  icon: LucideIcon;
  tooltipText: string;
}

export function TooltipButton({ icon: Icon, tooltipText }: TooltipButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" className="bg-primary-foreground">
          <Icon className="h-4 w-4 text-primary" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
}
