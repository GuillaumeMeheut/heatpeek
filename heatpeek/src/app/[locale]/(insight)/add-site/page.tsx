import { AddSite } from "./add-site";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";

export default async function PageList() {
  const supabase = await createClient();
  const { user } = await getUser(supabase);

  if (!user) redirect("/signin");

  return <AddSite />;
}
