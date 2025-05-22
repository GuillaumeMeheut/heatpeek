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
import { getI18n } from "@locales/server";

export default async function Pricing() {
  const t = await getI18n();

  const plans = [
    {
      name: t("pricing.plans.free.name"),
      price: t("pricing.plans.free.price"),
      description: t("pricing.plans.free.description"),
      features: [
        {
          name: t("pricing.plans.free.features.clickHeatmap"),
          value: t("pricing.features.basic"),
          icon: MousePointerClick,
        },
        {
          name: t("pricing.plans.free.features.rageClicks"),
          value: false,
          icon: AlertCircle,
        },
        {
          name: t("pricing.plans.free.features.scrollTracking"),
          value: false,
          icon: Scroll,
        },
        {
          name: t("pricing.plans.free.features.retention"),
          value: "7 days",
          icon: Calendar,
        },
        {
          name: t("pricing.plans.free.features.trackedPage"),
          value: "1",
          icon: Folder,
        },
        {
          name: t("pricing.plans.free.features.pageviews"),
          value: "500/month",
          icon: Eye,
        },
      ],
    },
    {
      name: t("pricing.plans.independent.name"),
      price: t("pricing.plans.independent.price"),
      description: t("pricing.plans.independent.description"),
      isPopular: true,
      features: [
        {
          name: t("pricing.plans.free.features.clickHeatmap"),
          value: true,
          icon: MousePointerClick,
        },
        {
          name: t("pricing.plans.free.features.rageClicks"),
          value: t("pricing.features.basic"),
          icon: AlertCircle,
        },
        {
          name: t("pricing.plans.free.features.scrollTracking"),
          value: true,
          icon: Scroll,
        },
        {
          name: t("pricing.plans.free.features.retention"),
          value: "30 days",
          icon: Calendar,
        },
        {
          name: t("pricing.plans.free.features.trackedPage"),
          value: "10",
          icon: Folder,
        },
        {
          name: t("pricing.plans.free.features.pageviews"),
          value: "5k/month",
          icon: Eye,
        },
      ],
    },
    {
      name: t("pricing.plans.pro.name"),
      price: t("pricing.plans.pro.price"),
      description: t("pricing.plans.pro.description"),
      features: [
        {
          name: t("pricing.plans.free.features.clickHeatmap"),
          value: true,
          icon: MousePointerClick,
        },
        {
          name: t("pricing.plans.free.features.rageClicks"),
          value: t("pricing.features.advanced"),
          icon: AlertCircle,
        },
        {
          name: t("pricing.plans.free.features.scrollTracking"),
          value: "✅ + Segments",
          icon: Scroll,
        },
        {
          name: t("pricing.plans.free.features.retention"),
          value: "90 days",
          icon: Calendar,
        },
        {
          name: t("pricing.plans.free.features.trackedPage"),
          value: "10",
          icon: Folder,
        },
        {
          name: t("pricing.plans.free.features.pageviews"),
          value: "100k/mo",
          icon: Eye,
        },
      ],
    },
    {
      name: t("pricing.plans.scale.name"),
      price: t("pricing.plans.scale.price"),
      description: t("pricing.plans.scale.description"),
      features: [
        {
          name: t("pricing.plans.free.features.clickHeatmap"),
          value: true,
          icon: MousePointerClick,
        },
        {
          name: t("pricing.plans.free.features.rageClicks"),
          value: t("pricing.features.advanced"),
          icon: AlertCircle,
        },
        {
          name: t("pricing.plans.free.features.scrollTracking"),
          value: "✅ Full control",
          icon: Scroll,
        },
        {
          name: t("pricing.plans.free.features.retention"),
          value: "180+ days",
          icon: Calendar,
        },
        {
          name: t("pricing.plans.free.features.trackedPage"),
          value: t("pricing.features.unlimited"),
          icon: Folder,
        },
        {
          name: t("pricing.plans.free.features.pageviews"),
          value: "1M+/mo",
          icon: Eye,
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t("pricing.title")}</h1>
        <p className="text-muted-foreground">{t("pricing.subtitle")}</p>
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
                  {t("pricing.plans.independent.popular")}
                </div>
              </div>
            )}
            <CardHeader className={cn("text-center", plan.isPopular && "pt-8")}>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <CardDescription className="text-3xl font-bold text-primary">
                  {plan.price.split("/")[0]}
                </CardDescription>
                <span className="text-sm text-muted-foreground">
                  {t("pricing.features.perMonth")}
                </span>
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
                {plan.name === t("pricing.plans.scale.name")
                  ? t("pricing.features.contactUs")
                  : t("pricing.features.getStarted")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
