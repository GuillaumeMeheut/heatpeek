import CardSign from "@/components/Auth/card-sign";
import { signIn } from "@/lib/auth-helpers/server";
import { getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const supabase = await createClient();

  const { user } = await getUser(supabase);

  if (user) redirect("/");

  return <CardSign isSignIn={true} onSubmit={signIn} />;
}
