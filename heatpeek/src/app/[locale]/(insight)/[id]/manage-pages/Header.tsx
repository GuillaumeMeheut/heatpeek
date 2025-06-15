import AddUrl from "./AddUrl";
import { getI18n } from "@locales/server";

export default async function Header({ projectId }: { projectId: string }) {
  const t = await getI18n();
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">{t("urlManagement.title")}</h1>
          <p className="text-muted-foreground">
            {t("urlManagement.description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AddUrl projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
