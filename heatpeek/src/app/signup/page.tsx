import { signUp } from "@/lib/auth-helpers/server";
import CardSign from "@/components/Auth/card-sign";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/queries";

export default async function SignUp() {
  const supabase = await createClient();

  const { user } = await getUser(supabase);

  if (user) redirect("/");

  return <CardSign isSignIn={false} onSubmit={signUp} />;
}
