import Heatmap from "@/components/Heatmap";

export default async function Dashboard() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Click Analytics</h2>
      <Heatmap />
    </div>
  );
}
