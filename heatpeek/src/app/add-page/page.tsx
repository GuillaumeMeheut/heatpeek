"use client";

import { useState } from "react";
import { SelectionStep } from "./components/selection-step";
import { AuthStep } from "./components/auth-step";
import { SimpleStep } from "./components/simple-step";

type Step = "select" | "simple" | "auth";

export default function AddPage() {
  const [currentStep, setCurrentStep] = useState<Step>("select");

  const handleBack = () => {
    if (currentStep === "select") {
      window.location.href = "/dashboard";
    } else {
      setCurrentStep("select");
    }
  };

  switch (currentStep) {
    case "select":
      return (
        <SelectionStep
          onSelectSimple={() => setCurrentStep("simple")}
          onSelectAuth={() => setCurrentStep("auth")}
          onBack={handleBack}
        />
      );
    case "auth":
      return <AuthStep onBack={handleBack} />;
    case "simple":
      return <SimpleStep onBack={handleBack} />;
    default:
      return null;
  }
}
