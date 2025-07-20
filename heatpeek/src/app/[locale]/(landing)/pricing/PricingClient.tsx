"use client";

import { useState } from "react";
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
import { Form } from "@/components/ui/form";
import { createCheckoutSession, createCustomerPortalSession } from "./actions";
import { useRouter } from "next/navigation";
import { useI18n } from "@locales/client";

// Types
type BillingPeriod = "monthly" | "yearly";

type PlanPeriod = {
  price: number;
  priceId: string | undefined;
  buttonText: string;
};

type Plan = {
  name: string;
  description: string;
  features: string[];
  popular: boolean;
  icon: React.ElementType;
  buttonVariant: "default" | "secondary";
  monthly: PlanPeriod;
  yearly: PlanPeriod;
};

type User = {
  id: string;
  email?: string;
};

type CustomerDetails = {
  stripe_customer_id: string;
  current_plan?: string;
};

// Utility functions
const getCardBorderClasses = (isPopular: boolean, isCurrentPlan: boolean) => {
  if (isCurrentPlan) return "border-secondary shadow-lg";
  if (isPopular) return "border-primary shadow-lg";
  return "";
};

const getIconColorClasses = (isCurrentPlan: boolean) => {
  const color = isCurrentPlan ? "secondary" : "primary";
  return {
    container: `bg-${color}/10`,
    icon: `text-${color}`,
  };
};

// Components
function PlanFeatures({ features }: { features: string[] }) {
  return (
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{feature}</span>
        </li>
      ))}
    </ul>
  );
}

function ManageSubscriptionForm({
  customerId,
  text,
  isCurrentPlan,
}: {
  customerId: string;
  text: string;
  isCurrentPlan: boolean;
}) {
  return (
    <Form action={createCustomerPortalSession} className="w-full">
      <input type="hidden" name="customerId" value={customerId} />
      <Button
        variant={isCurrentPlan ? "secondary" : "default"}
        className="w-full mb-4"
        type="submit"
      >
        {text}
      </Button>
    </Form>
  );
}

function PlanCard({
  plan,
  planPeriod,
  isCurrentPlan,
  isPopular,
  user,
  customerDetails,
}: {
  plan: Plan;
  planPeriod: PlanPeriod;
  isCurrentPlan: boolean;
  isPopular: boolean;
  user: User | null;
  customerDetails: CustomerDetails | null;
}) {
  const Icon = plan.icon;
  const hasSubscription = !!customerDetails?.stripe_customer_id;
  const router = useRouter();
  const iconClasses = getIconColorClasses(isCurrentPlan);
  const t = useI18n();

  const handleButtonClick = () => {
    if (!user) {
      router.push("/signin");
    }
  };

  return (
    <Card
      className={`relative flex flex-col ${getCardBorderClasses(
        isPopular,
        isCurrentPlan
      )}`}
      tabIndex={0}
      aria-label={`${plan.name} plan`}
    >
      {/* Badges */}
      {isPopular && !isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="px-4 py-1 text-xs shadow-md">
            <Star className="h-3 w-3 mr-1" /> {t("pricing.badges.mostPopular")}
          </Badge>
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge variant="secondary" className="px-4 py-1 text-xs shadow-md">
            {t("pricing.badges.currentPlan")}
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-8">
        <div className="flex justify-center mb-4">
          <div className={`p-3 rounded-full ${iconClasses.container}`}>
            <Icon className={`h-8 w-8 ${iconClasses.icon}`} />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          {plan.description}
        </CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">${planPeriod.price}</span>
          {planPeriod.price > 0 && (
            <span className="text-muted-foreground">/month</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        <PlanFeatures features={plan.features} />
      </CardContent>

      <CardFooter className="mt-auto">
        {hasSubscription ? (
          <ManageSubscriptionForm
            customerId={customerDetails!.stripe_customer_id}
            text={
              isCurrentPlan
                ? t("pricing.buttons.manageSubscription")
                : planPeriod.buttonText
            }
            isCurrentPlan={isCurrentPlan}
          />
        ) : user ? (
          <Form action={createCheckoutSession} className="w-full">
            <input type="hidden" name="userId" value={user?.id ?? undefined} />
            <input
              type="hidden"
              name="customerId"
              value={customerDetails?.stripe_customer_id ?? undefined}
            />
            <input
              type="hidden"
              name="userEmail"
              value={user?.email ?? undefined}
            />
            <input type="hidden" name="priceId" value={planPeriod.priceId} />
            <Button
              className="w-full"
              variant={plan.buttonVariant}
              size="lg"
              type="submit"
              aria-label={planPeriod.buttonText}
            >
              {planPeriod.buttonText}
            </Button>
          </Form>
        ) : (
          <Button
            className="w-full"
            variant={plan.buttonVariant}
            size="lg"
            onClick={handleButtonClick}
            aria-label={planPeriod.buttonText}
          >
            {planPeriod.buttonText}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function BillingToggle({
  billingPeriod,
  onBillingPeriodChange,
}: {
  billingPeriod: BillingPeriod;
  onBillingPeriodChange: (period: BillingPeriod) => void;
}) {
  const t = useI18n();

  return (
    <section className="flex justify-center mb-8">
      <div className="inline-flex rounded-lg bg-muted p-1">
        <button
          type="button"
          className={`px-4 py-2 rounded-md transition font-medium
            ${
              billingPeriod === "monthly"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }
          `}
          onClick={() => onBillingPeriodChange("monthly")}
          aria-pressed={billingPeriod === "monthly"}
        >
          {t("pricing.billing.monthly")}
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-md transition font-medium
            ${
              billingPeriod === "yearly"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }
          `}
          onClick={() => onBillingPeriodChange("yearly")}
          aria-pressed={billingPeriod === "yearly"}
        >
          {t("pricing.billing.yearly")}{" "}
          <span className="text-xs">{t("pricing.billing.yearlySavings")}</span>
        </button>
      </div>
    </section>
  );
}

function PricingHeader() {
  const t = useI18n();

  return (
    <section className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <Badge variant="secondary" className="mb-4">
        {t("pricing.header.badge")}
      </Badge>
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent md:leading-[1.3] leading-[1.4]">
        {t("pricing.header.title")}
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-8">
        {t("pricing.header.description")}
      </p>
    </section>
  );
}

// Main component
export default function PricingClient({
  user,
  customerDetails,
}: {
  user: User | null;
  customerDetails: CustomerDetails | null;
}) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const t = useI18n();

  // Create plans with translations
  const PLANS: Plan[] = [
    {
      name: t("pricing.plans.starter.name"),
      monthly: {
        price: 19,
        priceId: process.env.NEXT_PUBLIC_STARTER_MONTHLY_PRICE_ID,
        buttonText: t("pricing.plans.starter.buttons.getStarted"),
      },
      yearly: {
        price: 190,
        priceId: process.env.NEXT_PUBLIC_STARTER_YEARLY_PRICE_ID,
        buttonText: t("pricing.plans.starter.buttons.getStarted"),
      },
      description: t("pricing.plans.starter.description"),
      features: [
        t("pricing.plans.starter.features.0"),
        t("pricing.plans.starter.features.1"),
        t("pricing.plans.starter.features.2"),
        t("pricing.plans.starter.features.3"),
        t("pricing.plans.starter.features.4"),
        t("pricing.plans.starter.features.5"),
        t("pricing.plans.starter.features.6"),
        t("pricing.plans.starter.features.7"),
        t("pricing.plans.starter.features.8"),
        t("pricing.plans.starter.features.9"),
        t("pricing.plans.starter.features.10"),
      ],
      popular: false,
      icon: BarChart3,
      buttonVariant: "secondary",
    },
    {
      name: t("pricing.plans.pro.name"),
      monthly: {
        price: 49,
        priceId: process.env.NEXT_PUBLIC_PRO_MONTHLY_PRICE_ID,
        buttonText: t("pricing.plans.pro.buttons.upgrade"),
      },
      yearly: {
        price: 490,
        priceId: process.env.NEXT_PUBLIC_PRO_YEARLY_PRICE_ID,
        buttonText: t("pricing.plans.pro.buttons.upgrade"),
      },
      description: t("pricing.plans.pro.description"),
      features: [
        t("pricing.plans.pro.features.0"),
        t("pricing.plans.pro.features.1"),
        t("pricing.plans.pro.features.2"),
        t("pricing.plans.pro.features.3"),
        t("pricing.plans.pro.features.4"),
        t("pricing.plans.pro.features.5"),
      ],
      popular: true,
      icon: LayoutDashboard,
      buttonVariant: "default",
    },
    {
      name: t("pricing.plans.business.name"),
      monthly: {
        price: 129,
        priceId: process.env.NEXT_PUBLIC_BUSINESS_MONTHLY_PRICE_ID,
        buttonText: t("pricing.plans.business.buttons.upgrade"),
      },
      yearly: {
        price: 1290,
        priceId: process.env.NEXT_PUBLIC_BUSINESS_YEARLY_PRICE_ID,
        buttonText: t("pricing.plans.business.buttons.upgrade"),
      },
      description: t("pricing.plans.business.description"),
      features: [
        t("pricing.plans.business.features.0"),
        t("pricing.plans.business.features.1"),
        t("pricing.plans.business.features.2"),
        t("pricing.plans.business.features.3"),
        t("pricing.plans.business.features.4"),
        t("pricing.plans.business.features.5"),
      ],
      popular: false,
      icon: LineChart,
      buttonVariant: "default",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PricingHeader />

      <BillingToggle
        billingPeriod={billingPeriod}
        onBillingPeriodChange={setBillingPeriod}
      />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((plan) => {
              const planPeriod = plan[billingPeriod];
              const isCurrentPlan =
                customerDetails?.current_plan?.toLowerCase() ===
                plan.name.toLowerCase();

              return (
                <PlanCard
                  key={plan.name}
                  plan={plan}
                  planPeriod={planPeriod}
                  isCurrentPlan={isCurrentPlan}
                  isPopular={plan.popular}
                  user={user}
                  customerDetails={customerDetails}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
