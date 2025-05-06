import Heatmap from "@/components/Heatmap";
import { getClicks } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import pageData from "../../../public/pageData.json";
import clicks from "../../../public/clicks.json";

export default async function Dashboard() {
  // const supabase = await createClient();
  // const projectId = "guillaume-meheut.vercel.app";
  // const url = "http://localhost:3001/";

  // const clicks = await getClicks(supabase, projectId, url);
  // console.log(clicks);
  // Fetch the page data
  // const response = await fetch(
  //   `http://localhost:3000/api/capturePage?url=${encodeURIComponent(url)}`
  // );
  // const pageData = await response.json();

  // Calculate the aspect ratio to maintain the same proportions
  const aspectRatio =
    pageData.metadata.dimensions.height / pageData.metadata.dimensions.width;

  // Set a max width and calculate height based on aspect ratio
  const maxWidth = 1510;
  const width = Math.min(maxWidth, pageData.metadata.dimensions.width);
  const height = Math.round(width * aspectRatio);

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Click Analytics</h2>
      <Heatmap
        clicks={clicks || []}
        pageData={pageData}
        width={width}
        height={height}
      />
    </div>
  );
}
