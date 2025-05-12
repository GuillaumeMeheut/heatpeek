import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SnapshotUrl } from "@/lib/supabase/queries";
import { Laptop } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

type UrlListProps = {
  isVisible: boolean;
  snapshotsUrls: SnapshotUrl[];
};

export function UrlList({ isVisible, snapshotsUrls }: UrlListProps) {
  const URL_LIST = useMemo(() => {
    // Group URLs by their base URL
    const groupedUrls = snapshotsUrls.reduce((acc, snapshot) => {
      const url = new URL(snapshot.url);
      const baseUrl = `${url.protocol}//${url.host}`;
      const path = url.pathname;

      if (!acc[baseUrl]) {
        acc[baseUrl] = {
          domain: url.host,
          baseUrl,
          paths: [],
        };
      }

      // Only add the path if it's not already in the list
      if (!acc[baseUrl].paths.some((p) => p.path === path)) {
        acc[baseUrl].paths.push({
          path,
          label: snapshot.label || (path === "/" ? "Home" : path),
        });
      }

      return acc;
    }, {} as Record<string, { domain: string; baseUrl: string; paths: { path: string; label: string }[] }>);

    return Object.values(groupedUrls);
  }, [snapshotsUrls]);

  return (
    <div className={`${isVisible ? "block" : "hidden"} mt-4`}>
      <TooltipProvider>
        <Accordion type="multiple" className="w-full">
          {URL_LIST.map((site) => (
            <AccordionItem key={site.domain} value={site.domain}>
              <AccordionTrigger className="hover:no-underline w-full px-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="truncate block">{site.domain}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{site.domain}</p>
                  </TooltipContent>
                </Tooltip>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-1 pl-6">
                  {site.paths.map((path) => (
                    <Link
                      key={path.path}
                      href={`/dashboard?url=${site.baseUrl}${path.path}&device=desktop`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center w-full"
                    >
                      <Laptop className="h-4 w-4 mr-2 shrink-0" />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="truncate flex-1">{path.label}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{path.path}</p>
                        </TooltipContent>
                      </Tooltip>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TooltipProvider>
    </div>
  );
}
