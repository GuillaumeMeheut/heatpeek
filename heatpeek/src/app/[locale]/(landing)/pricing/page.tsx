import { getI18n } from "@locales/server";
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

export default async function Pricing() {
  const t = await getI18n();

  const plans = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for getting started with heatmap analytics",
      features: [
        "Click heatmap",
        "Rage clicks detection",
        "Scroll depth analysis",
        "First clicked element tracking",
        "2000 tracked pageviews/month",
        "1 tracked website",
        "2 tracked pages",
        "3 months retention storage",
        "Basic analytics dashboard",
        "Email support",
      ],
      popular: false,
      icon: BarChart3,
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
    },
    {
      name: "Starter",
      price: 15,
      description: "For indie devs or small projects wanting deeper insights",
      features: [
        "Everything in Free",
        "10,000 tracked pageviews/month",
        "3 tracked websites",
        "5 tracked pages per site",
        "6 months retention storage",
        "Custom page targeting (URL includes/excludes)",
        "Advanced filters (device, viewport)",
        "Email + priority support",
      ],
      popular: false,
      icon: LayoutDashboard,
      buttonText: "Start with Starter",
      buttonVariant: "default",
    },
    {
      name: "Pro",
      price: 39,
      description: "For growing products and teams that need scale",
      features: [
        "Everything in Starter",
        "50,000 tracked pageviews/month",
        "Unlimited tracked websites",
        "Unlimited tracked pages",
        "12 months retention storage",
        "Daily export of click data (CSV)",
        "Team access (up to 5 members)",
        "Slack notifications for rage clicks",
        "Email + chat support",
      ],
      popular: true,
      icon: LineChart,
      buttonText: "Upgrade to Pro",
      buttonVariant: "default",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
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

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <Card
                  key={plan.name}
                  className={`relative transition-all duration-300 hover:shadow-xl ${
                    plan.popular
                      ? "border-primary shadow-lg scale-105"
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

                  <CardHeader className="text-center pb-8">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <IconComponent className="h-8 w-8 text-primary" />
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

                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={plan.buttonVariant}
                      size="lg"
                    >
                      {plan.buttonText}
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
