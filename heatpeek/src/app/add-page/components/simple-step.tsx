"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Monitor,
  Tablet,
  Smartphone,
  Loader2,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

type SimpleStepProps = {
  onBack: () => void;
};

export function SimpleStep({ onBack }: SimpleStepProps) {
  const [popupBlocking, setPopupBlocking] = useState("omit-popups");
  const [cssSelectors, setCssSelectors] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [snapshotName, setSnapshotName] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>(["desktop"]);

  const toggleDevice = (device: string) => {
    setSelectedDevices((prev) =>
      prev.includes(device)
        ? prev.filter((d) => d !== device)
        : [...prev, device]
    );
  };

  const isFormValid = () => {
    const hasRequiredFields =
      websiteUrl.trim() !== "" && snapshotName.trim() !== "";
    const hasValidCssSelectors =
      popupBlocking !== "specific-elements" || cssSelectors.trim() !== "";
    const hasSelectedDevice = selectedDevices.length > 0;
    return hasRequiredFields && hasValidCssSelectors && hasSelectedDevice;
  };

  const addNewSnapshot = async () => {
    setIsLoading(true);
    try {
      // First capture the page for each selected device
      for (const device of selectedDevices) {
        const captureResponse = await fetch(`/api/capturePage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: websiteUrl,
            label: snapshotName,
            device: device,
          }),
        });

        if (!captureResponse.ok) {
          throw new Error(`Failed to capture page for device: ${device}`);
        }
      }

      // TODO: Add success notification
    } catch (error) {
      console.error("Error capturing page:", error);
      // TODO: Add proper error handling UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>
        </div>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Step 1: Add Your Page URL</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Enter the URL of the page you want to track. Make sure the page
                is publicly accessible.
              </p>
              <h4 className="font-medium pt-4">Your Page</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <Input
                    type="text"
                    placeholder="https://example.com/page"
                    className="w-full p-2 rounded-md border bg-background"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Snapshot name</Label>
                  <Input
                    type="text"
                    placeholder="Landing Page"
                    className="w-full p-2 rounded-md border bg-background"
                    value={snapshotName}
                    onChange={(e) => setSnapshotName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardContent>
            <div className="space-y-4">
              <h4 className="font-medium">Select Devices</h4>
              <div className="flex gap-4">
                <Button
                  variant={
                    selectedDevices.includes("desktop") ? "default" : "outline"
                  }
                  size="icon"
                  onClick={() => toggleDevice("desktop")}
                  className="h-12 w-12"
                >
                  <Monitor className="h-6 w-6" />
                </Button>
                <Button
                  variant={
                    selectedDevices.includes("tablet") ? "default" : "outline"
                  }
                  size="icon"
                  onClick={() => toggleDevice("tablet")}
                  className="h-12 w-12"
                >
                  <Tablet className="h-6 w-6" />
                </Button>
                <Button
                  variant={
                    selectedDevices.includes("mobile") ? "default" : "outline"
                  }
                  size="icon"
                  onClick={() => toggleDevice("mobile")}
                  className="h-12 w-12"
                >
                  <Smartphone className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardContent>
            <div className="space-y-4">
              <h4 className="font-medium">Blocking Pop-Ups</h4>

              <RadioGroup
                value={popupBlocking}
                onValueChange={setPopupBlocking}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="omit-popups" id="omit-popups" />
                  <Label htmlFor="omit-popups">Omit pop-ups</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dont-block" id="dont-block" />
                  <Label htmlFor="dont-block">Don&apos;t block anything</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="specific-elements"
                    id="specific-elements"
                  />
                  <Label htmlFor="specific-elements">
                    Omit specific elements
                  </Label>
                </div>
              </RadioGroup>
              {popupBlocking === "specific-elements" && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="css-selectors">CSS Selectors</Label>
                  <Input
                    id="css-selectors"
                    placeholder=".cookie-banner, #newsletter-popup"
                    value={cssSelectors}
                    onChange={(e) => setCssSelectors(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter CSS selectors separated by commas
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              disabled={!isFormValid() || isLoading}
              onClick={addNewSnapshot}
            >
              Continue
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4 ml-2" />
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
