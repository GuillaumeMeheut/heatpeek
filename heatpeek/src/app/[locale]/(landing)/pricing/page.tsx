import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Star,
  LineChart,
  BarChart3,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function Pricing() {
  const supabase = createClient();
  const { user } = await getUser(supabase);

  let userSubscription = null;

  if (user) {
    const { data: userSubscriptionData } = await supabase
      .from("subscriptions")
      .select("price_id, status")
      .eq("user_id", user?.id)
      .order("current_period_start", { ascending: false })
      .limit(1)
      .maybeSingle();

    userSubscription = userSubscriptionData;
  }

  function mapPriceIdToTier(
    priceId: string | null
  ): "starter" | "pro" | "business" | null {
    switch (priceId) {
      case "price_1Rkl65IhQf3PD3CRYSEz91gf":
        return "starter";
      case "price_123PROD_PRO_ID":
        return "pro";
      default:
        return null;
    }
  }

  const plans = [
    {
      name: "Starter",
      price: 19,
      description: "For indie devs or small projects wanting deeper insights",
      features: [
        "Click heatmap",
        "Rage clicks heatmap",
        "Scroll depth heatmap",
        "First clicked element tracking",
        "30,000 tracked pageviews/month",
        "3 tracked websites",
        "10 tracked pages",
        "3 months retention storage",
        "Analytics dashboard",
        "Email support",
      ],
      popular: false,
      icon: BarChart3,
      buttonText: "Get Started Free",
      buttonVariant: "secondary" as const,
      link: "https://buy.stripe.com/test_4gM9AT9yr1XH1w03rNdEs02",
      priceId: "price_1RlEKNIhQf3PD3CROq3eDOqZ",
    },
    {
      name: "Pro",
      price: 49,
      description: "For indie devs or small projects wanting deeper insights",
      features: [
        "Everything in Free",
        "100,000 tracked pageviews/month",
        "10 tracked websites",
        "30 tracked pages",
        "6 months retention storage",
        "Email support",
      ],
      popular: true,
      icon: LayoutDashboard,
      buttonText: "Upgrade to Pro",
      buttonVariant: "default" as const,
      link: "https://buy.stripe.com/test_fZu3cv3a3dGp7Uo8M7dEs04",
      priceId: "price_1RlEQTIhQf3PD3CRzUqY2jWw",
    },
    {
      name: "Business",
      price: 129,
      description: "For growing products and teams that need scale",
      features: [
        "Everything in Starter",
        "400,000 tracked pageviews/month",
        "30 tracked websites",
        "100 tracked pages",
        "12 months retention storage",
        "Email priority support",
      ],
      popular: false,
      icon: LineChart,
      buttonText: "Upgrade to Business",
      buttonVariant: "default" as const,
      link: "https://buy.stripe.com/test_5kQ14naCv0TDb6A9QbdEs06",
      priceId: "price_1RlETFIhQf3PD3CRsUaD0sJS",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <Badge variant="secondary" className="mb-4">
          Pricing Plans
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent md:leading-[1.3] leading-[1.4]">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Choose the perfect plan for your analytics needs. Start free and
          upgrade as you grow.
        </p>
      </section>

      {/* Plans */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrent =
                userSubscription?.tier === plan.name.toLowerCase();

              const linkWithEmail =
                user && plan.price > 0 && plan.link
                  ? `${plan.link}?prefilled_email=${user.email}`
                  : plan.link;

              return (
                <Card
                  key={plan.name}
                  className={`relative transition-all duration-300 hover:shadow-xl flex flex-col ${
                    plan.popular
                      ? "border-primary shadow-lg scale-105"
                      : isCurrent
                      ? "border-secondary shadow-lg scale-105"
                      : "hover:scale-105"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-secondary text-white px-4 py-1">
                        Current Plan
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="mt-auto">
                    <Button
                      asChild
                      className="w-full"
                      variant={plan.buttonVariant}
                      size="lg"
                      disabled={isCurrent}
                      aria-disabled={isCurrent}
                    >
                      <Link href={linkWithEmail} target="_blank">
                        {isCurrent ? "Current Plan" : plan.buttonText}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
