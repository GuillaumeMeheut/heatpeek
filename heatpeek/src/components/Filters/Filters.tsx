import { Button } from "@/components/ui/button";

import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUrls } from "@/lib/supabase/queries";
import { FiltersUrl } from "./FiltersUrl";
import { FiltersDate } from "./FiltersDate";
import { FiltersDevice } from "./FiltersDevice";

export async function Filters({ projectId }: { projectId: string }) {
  const supabase = createClient();

  const urls = await getUrls(supabase, projectId);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 border-b  pb-6">
      <FiltersDate />
      <FiltersUrl urls={urls} projectId={projectId} />
      <FiltersDevice />
      <div className="ml-auto">
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
