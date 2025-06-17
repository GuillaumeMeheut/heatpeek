import { getI18n } from "@locales/server";
import AddProject from "./AddProject";

export default async function Header() {
  const t = await getI18n();
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">{t("projects.title")}</h1>
          <p className="text-muted-foreground">{t("projects.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <AddProject />
        </div>
      </div>
    </div>
  );
}
