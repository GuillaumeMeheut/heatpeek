import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  MousePointerClick,
  AlertCircle,
  Scroll,
  Calendar,
  Folder,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for passion projects & simple websites",
    features: [
      { name: "Click Heatmap", value: "Basic", icon: MousePointerClick },
      { name: "Rage Clicks", value: false, icon: AlertCircle },
      { name: "Scroll Tracking", value: false, icon: Scroll },
      { name: "Retention", value: "7 days", icon: Calendar },
      { name: "Tracked Page", value: "1", icon: Folder },
      { name: "Pageviews", value: "500/month", icon: Eye },
    ],
  },
  {
    name: "Independent",
    price: "$9/mo",
    description: "For production applications with the power to scale",
    isPopular: true,
    features: [
      { name: "Click Heatmap", value: true, icon: MousePointerClick },
      { name: "Rage Clicks", value: "Basic", icon: AlertCircle },
      { name: "Scroll Tracking", value: true, icon: Scroll },
      { name: "Retention", value: "30 days", icon: Calendar },
      { name: "Tracked Page", value: "10", icon: Folder },
      { name: "Pageviews", value: "5k/month", icon: Eye },
    ],
  },
  {
    name: "Pro",
    price: "$29/mo",
    description: "For growing businesses with advanced needs",
    features: [
      { name: "Click Heatmap", value: true, icon: MousePointerClick },
      { name: "Rage Clicks", value: "Advanced", icon: AlertCircle },
      { name: "Scroll Tracking", value: "✅ + Segments", icon: Scroll },
      { name: "Retention", value: "90 days", icon: Calendar },
      { name: "Tracked Page", value: "10", icon: Folder },
      { name: "Pageviews", value: "100k/mo", icon: Eye },
    ],
  },
  {
    name: "Scale",
    price: "$79+",
    description:
      "For large-scale applications running Internet scale workloads",
    features: [
      { name: "Click Heatmap", value: true, icon: MousePointerClick },
      { name: "Rage Clicks", value: "Advanced", icon: AlertCircle },
      { name: "Scroll Tracking", value: "✅ Full control", icon: Scroll },
      { name: "Retention", value: "180+ days", icon: Calendar },
      { name: "Tracked Page", value: "Unlimited", icon: Folder },
      { name: "Pageviews", value: "1M+/mo", icon: Eye },
    ],
  },
];

export default function Pricing() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
        <p className="text-muted-foreground">
          Choose the plan that&apos;s right for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "flex flex-col transition-all duration-200 hover:shadow-lg relative",
              plan.isPopular && "border-primary"
            )}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium shadow-sm">
                  Most Popular
                </div>
              </div>
            )}
            <CardHeader className={cn("text-center", plan.isPopular && "pt-8")}>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <CardDescription className="text-3xl font-bold text-primary">
                  {plan.price.split("/")[0]}
                </CardDescription>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {plan.description}
              </p>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <li key={feature.name} className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {typeof feature.value === "boolean" ? (
                        feature.value ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <span className="h-4 w-4 text-red-500 flex items-center justify-center">
                            ×
                          </span>
                        )
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {feature.value}
                        </span>
                      )}
                      <span className="text-sm">{feature.name}</span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.isPopular ? "default" : "outline"}
                size="lg"
              >
                {plan.name === "Scale" ? "Contact Us" : "Get Started"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
