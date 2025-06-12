import { Button } from "@/components/ui/button";

import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSnapshotsInfos } from "@/lib/supabase/queries";
import { FiltersUrl } from "./FiltersUrl";
import { FiltersDate } from "./FiltersDate";

export async function Filters({ projectId }: { projectId: string }) {
  const supabase = createClient();
  const snapshots = await getSnapshotsInfos(supabase, projectId);
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <FiltersDate />
      <FiltersUrl snapshots={snapshots} />
      <div className="ml-auto">
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
