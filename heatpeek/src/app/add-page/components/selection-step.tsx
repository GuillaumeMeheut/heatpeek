"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Lock } from "lucide-react";
import { TrackingScript } from "@/components/TrackingScript";

type SelectionStepProps = {
  onSelectSimple: () => void;
  onSelectAuth: () => void;
  trackingId: string | null;
};

export function SelectionStep({
  onSelectSimple,
  onSelectAuth,
  trackingId,
}: SelectionStepProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            First, Add the Tracking Script
          </h2>
          <p className="text-muted-foreground mb-6">
            Before creating your page, you need to add our tracking script to
            your website. This script will enable HeatPeek to collect and
            analyze user interactions on your pages.
          </p>
          <TrackingScript id={trackingId} />
        </div>

        <h2 className="text-2xl font-semibold mb-4">
          Then, Choose Your Page Type
        </h2>
        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Simple Page Card */}
          <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Add a Simple Page</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">Create a new single page.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={onSelectSimple}>
                Create Simple Page
              </Button>
            </CardFooter>
          </Card>

          {/* Auth Page Card */}
          <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Add a Page Behind Auth</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">
                Create a new page that requires user authentication to access.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={onSelectAuth}>
                Create Auth Page
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
