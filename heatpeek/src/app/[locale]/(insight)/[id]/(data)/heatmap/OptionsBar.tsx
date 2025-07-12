"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { MousePointerClick, Mouse, Eye, LucideIcon, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@locales/client";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { HeatmapType } from "./types";
import { useDebouncedState } from "@/hooks/debounce";

interface TooltipButtonProps {
  icon: LucideIcon;
  tooltip: string;
  onClick?: () => void;
  active?: boolean;
}

function TooltipButton({
  icon: Icon,
  tooltip,
  onClick,
  active,
}: TooltipButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className={`${
            active ? "" : "bg-transparent color-white border-white border-[1px]"
          }`}
          onClick={onClick}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-secondary">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface OptionsBarProps {
  opacity: number;
  onOpacityChange?: (opacity: number) => void;
  activeType: HeatmapType;
}

export function OptionsBar({
  opacity,
  onOpacityChange,
  activeType,
}: OptionsBarProps) {
  const t = useI18n();

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleTypeChange = (type: HeatmapType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type);
    router.replace(`?${params.toString()}`);
  };

  const [localOpacity, setLocalOpacity] = useDebouncedState(
    opacity,
    200,
    (debouncedValue) => onOpacityChange?.(debouncedValue)
  );

  return (
    <TooltipProvider>
      <div className="fixed left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-4 px-4 py-3 bg-black/90 backdrop-blur-sm rounded-full shadow-lg z-50 border border-white/30">
        <div className="flex gap-2">
          <TooltipButton
            icon={MousePointerClick}
            tooltip={t("optionsBar.clickPatterns")}
            onClick={() => handleTypeChange(HeatmapType.Clicks)}
            active={activeType === HeatmapType.Clicks}
          />
          <TooltipButton
            icon={Zap}
            tooltip={t("optionsBar.rageClicks")}
            onClick={() => handleTypeChange(HeatmapType.RageClicks)}
            active={activeType === HeatmapType.RageClicks}
          />
          <TooltipButton
            icon={Mouse}
            tooltip={t("optionsBar.scroll")}
            onClick={() => handleTypeChange(HeatmapType.ScrollDepth)}
            active={activeType === HeatmapType.ScrollDepth}
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
            value={[localOpacity]}
            onValueChange={(value: number[]) => setLocalOpacity(value[0])}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
