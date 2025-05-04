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
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

type SimpleStepProps = {
  onBack: () => void;
};

export function SimpleStep({ onBack }: SimpleStepProps) {
  const [popupBlocking, setPopupBlocking] = useState("dont-block");
  const [cssSelectors, setCssSelectors] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [snapshotName, setSnapshotName] = useState("");

  const isFormValid = () => {
    const hasRequiredFields =
      websiteUrl.trim() !== "" && snapshotName.trim() !== "";
    const hasValidCssSelectors =
      popupBlocking !== "specific-elements" || cssSelectors.trim() !== "";
    return hasRequiredFields && hasValidCssSelectors;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>
        </div>

        {/* Simple Page Steps */}
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
            <Button className="w-full" disabled={!isFormValid()}>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
