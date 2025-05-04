"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Image } from "lucide-react";
import Link from "next/link";

type AuthStepProps = {
  onBack: () => void;
};

export function AuthStep({ onBack }: AuthStepProps) {
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

        {/* Auth Page Steps */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Step 1: Take a Screenshot</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                To create an auth-protected page, you&apos;ll need to take a
                screenshot of the page using our browser extension.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  How to take a screenshot:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>
                    Install our browser extension if you haven&apos;t already
                  </li>
                  <li>Log in and navigate to the page you want to track</li>
                  <li>
                    Click the extension icon and select &quot;Take
                    Screenshot&quot;
                  </li>
                  <li>Wait for the screenshot to be processed</li>
                </ol>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="https://chrome.google.com/webstore/detail/heatpeek/your-extension-id">
                Install Extension
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
