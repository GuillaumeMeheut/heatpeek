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
import { Laptop, Smartphone } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

type UrlListProps = {
  isVisible: boolean;
  snapshotsUrls: SnapshotUrl[];
};

export function UrlList({ isVisible, snapshotsUrls }: UrlListProps) {
  const URL_LIST = useMemo(() => {
    // Group URLs by their base URL
    const groupedUrls = snapshotsUrls.reduce(
      (acc, snapshot) => {
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

        // Find if the path already exists
        const existingPath = acc[baseUrl].paths.find((p) => p.path === path);

        if (existingPath) {
          // Always add the device, allowing duplicates
          existingPath.devices.push({
            device: snapshot.device,
            label: snapshot.label || (path === "/" ? "Home" : path),
            created_at: snapshot.created_at,
            id: snapshot.id,
          });
        } else {
          // Create new path entry
          acc[baseUrl].paths.push({
            path,
            devices: [
              {
                device: snapshot.device,
                label: snapshot.label || (path === "/" ? "Home" : path),
                created_at: snapshot.created_at,
                id: snapshot.id,
              },
            ],
          });
        }

        return acc;
      },
      {} as Record<
        string,
        {
          domain: string;
          baseUrl: string;
          paths: {
            path: string;
            devices: {
              device: string;
              label: string;
              created_at: string;
              id: string;
            }[];
          }[];
        }
      >
    );

    return Object.values(groupedUrls);
  }, [snapshotsUrls]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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
                    <div key={path.path} className="space-y-1">
                      {path.devices.map((device) => (
                        <Link
                          key={`${path.path}-${device.device}-${device.created_at}`}
                          href={`/dashboard?id=${device.id}`}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center w-full"
                        >
                          {device.device === "desktop" ? (
                            <Laptop className="h-4 w-4 mr-2 shrink-0" />
                          ) : (
                            <Smartphone className="h-4 w-4 mr-2 shrink-0" />
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="truncate flex-1">
                                {device.label} - {formatDate(device.created_at)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {path.path} ({device.device})
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </Link>
                      ))}
                    </div>
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
