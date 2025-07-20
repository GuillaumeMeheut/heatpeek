"use client";

import { TrackingScript } from "@/components/TrackingScript";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

interface StepProps {
  number: number;
  title: string;
  description: string;
  children?: React.ReactNode;
}

function Step({ number, title, description, children }: StepProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
          {number}
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <p className="text-muted-foreground mb-4">{description}</p>
      {children}
    </Card>
  );
}

function CopyScriptStep({ trackingId }: { trackingId: string | null }) {
  return (
    <Step
      number={1}
      title="Copy the Tracking Script"
      description="Copy the tracking script below and paste it in your website's &lt;head&gt; tag"
    >
      <TrackingScript id={trackingId} />
    </Step>
  );
}

function DeployStep() {
  return (
    <Step
      number={2}
      title="Deploy Your Website"
      description="Deploy your website with the tracking script added to the &lt;head&gt; tag"
    />
  );
}

function VerifyStep({
  trackingId,
  baseUrl,
}: {
  trackingId: string | null;
  baseUrl: string | null;
}) {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(
    null
  );

  const verifyInstallation = async () => {
    if (!trackingId) return;

    setVerifying(true);
    setVerificationResult(null);

    try {
      window.open(`${baseUrl}?verifyHp=${trackingId}`, "_blank");

      // Poll for verification status
      const checkVerification = async () => {
        try {
          const response = await fetch(
            `${process.env.PUBLIC_SITE_URL}api/verify/${trackingId}`
          );
          if (!response.ok) {
            throw new Error("Verification failed");
          }
          const data = await response.json();
          if (data.verified) {
            setVerificationResult(true);
            return true;
          }
          return false;
        } catch {
          return false;
        }
      };

      // Poll every 2 seconds for up to 30 seconds
      let attempts = 0;
      const maxAttempts = 8;
      const pollInterval = setInterval(async () => {
        attempts++;
        const verified = await checkVerification();
        if (verified || attempts >= maxAttempts) {
          clearInterval(pollInterval);
          if (!verified) {
            setVerificationResult(false);
          }
          setVerifying(false);
        }
      }, 2000);
    } catch {
      setVerificationResult(false);
      setVerifying(false);
    }
  };

  return (
    <Step
      number={3}
      title="Verify Installation"
      description="Click the verify button to confirm the tracking script is working correctly"
    >
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="default"
          onClick={verifyInstallation}
          disabled={verifying}
          className="flex items-center gap-2"
        >
          {verifying ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Verify Installation
            </>
          )}
        </Button>
        {verificationResult !== null && (
          <span
            className={`text-sm ${
              verificationResult ? "text-green-600" : "text-red-600"
            }`}
          >
            {verificationResult
              ? "Installation verified successfully!"
              : "Installation not detected. Please check your setup."}
          </span>
        )}
      </div>
    </Step>
  );
}

export function SetupSite({
  trackingId,
  baseUrl,
}: {
  trackingId: string | null;
  baseUrl: string | null;
}) {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Setup Your Site</h1>
        <p className="text-muted-foreground">
          Follow these steps to add HeatPeek tracking to your website
        </p>
      </div>

      <div className="space-y-6">
        <CopyScriptStep trackingId={trackingId} />
        <DeployStep />
        <VerifyStep trackingId={trackingId} baseUrl={baseUrl} />
      </div>
    </div>
  );
}
