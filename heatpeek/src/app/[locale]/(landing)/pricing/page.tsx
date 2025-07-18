import { getCustomerDetails, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import PricingClient from "./PricingClient";

export default async function Pricing() {
  const supabase = createClient();
  const { user } = await getUser(supabase);

  let customerDetails = null;
  if (user) {
    customerDetails = await getCustomerDetails(supabase, user.id);
  }
  return <PricingClient user={user} customerDetails={customerDetails} />;
}
