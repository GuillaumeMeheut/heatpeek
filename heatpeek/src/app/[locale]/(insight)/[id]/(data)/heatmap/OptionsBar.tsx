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
  Zap,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@locales/client";

interface TooltipButtonProps {
  icon: LucideIcon;
  tooltip: string;
}

function TooltipButton({ icon: Icon, tooltip }: TooltipButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="secondary">
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface OptionsBarProps {
  opacity: number;
  onOpacityChange?: (opacity: number) => void;
}

export function OptionsBar({ opacity, onOpacityChange }: OptionsBarProps) {
  const t = useI18n();

  return (
    <TooltipProvider>
      <div className="fixed left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-4 px-4 py-3 bg-black/90 backdrop-blur-sm rounded-full shadow-lg z-30 border border-white/30">
        <div className="flex gap-2">
          <TooltipButton
            icon={MousePointerClick}
            tooltip={t("optionsBar.clickPatterns")}
          />
          <TooltipButton icon={Zap} tooltip={t("optionsBar.rageClicks")} />
          <TooltipButton icon={Mouse} tooltip={t("optionsBar.scroll")} />
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex gap-2">
          <TooltipButton icon={Monitor} tooltip={t("optionsBar.desktopView")} />
          <TooltipButton icon={Tablet} tooltip={t("optionsBar.tabletView")} />
          <TooltipButton
            icon={Smartphone}
            tooltip={t("optionsBar.mobileView")}
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-2 w-32">
          <Tooltip>
            <TooltipTrigger asChild>
              <Eye className="h-4 w-4 text-secondary" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("optionsBar.opacity")}</p>
            </TooltipContent>
          </Tooltip>
          <Slider
            defaultValue={[opacity]}
            onValueCommit={(value) => onOpacityChange?.(value[0])}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
