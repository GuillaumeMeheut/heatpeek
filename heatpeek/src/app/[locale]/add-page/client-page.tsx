"use client";

import { useState } from "react";
import { SelectionStep } from "./components/selection-step";
import { AuthStep } from "./components/auth-step";
import { SimpleStep } from "./components/simple-step";

type Step = "select" | "simple" | "auth";

export function ClientAddPage({ trackingId }: { trackingId: string | null }) {
  const [currentStep, setCurrentStep] = useState<Step>("select");

  const handleBack = () => setCurrentStep("select");

  switch (currentStep) {
    case "select":
      return (
        <SelectionStep
          onSelectSimple={() => setCurrentStep("simple")}
          onSelectAuth={() => setCurrentStep("auth")}
          trackingId={trackingId}
        />
      );
    case "auth":
      return <AuthStep onBack={handleBack} />;
    case "simple":
      return <SimpleStep onBack={handleBack} trackingId={trackingId} />;
    default:
      return null;
  }
}
