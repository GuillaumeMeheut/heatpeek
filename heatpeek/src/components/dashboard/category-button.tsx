import { Button } from "@/components/ui/button";
import { HelpCircle, LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoryButtonProps {
  icon: LucideIcon;
  label: string;
  description: string;
}

export function CategoryButton({
  icon: Icon,
  label,
  description,
}: CategoryButtonProps) {
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        className="justify-start hover:bg-primary/10 text-primary flex-1"
      >
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
