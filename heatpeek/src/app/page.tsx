import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, BarChart2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent md:leading-[1.3] leading-[1.4]">
          Privacy-Focused Heatmap Analytics
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Understand your users without compromising their privacy. Heatpeek
          provides lightweight, privacy-respecting heatmap analytics for your
          website.
        </p>
        <div className="flex gap-4">
          <Button size="lg" className="gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            View Demo
          </Button>
        </div>
      </section>

      {/* Dashboard Screenshots Section */}
      <section className="pb-[240px] px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* First screenshot - centered */}
            <div className="relative z-10 mx-auto w-full max-w-3xl">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="/dashboard-1.jpg"
                  alt="Dashboard Overview"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Second screenshot - offset to the right */}
            <div className="absolute z-20 top-1/4 right-0 w-full max-w-2xl transform translate-x-1/4">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="/dashboard-1.jpg"
                  alt="Click Analytics"
                  width={1000}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Third screenshot - offset to the left */}
            <div className="absolute z-30 top-1/2 left-0 w-full max-w-2xl transform -translate-x-1/4">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="/dashboard-1.jpg"
                  alt="Scroll Analytics"
                  width={1000}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Heatpeek?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-muted-foreground">
                Built with privacy in mind. No personal data collection, just
                anonymous interaction data.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lightweight</h3>
              <p className="text-muted-foreground">
                Tiny script that won&apos;t slow down your website. Less than
                5KB gzipped.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background">
              <BarChart2 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Powerful Insights</h3>
              <p className="text-muted-foreground">
                Get clear visualizations of user behavior to improve your
                website&apos;s UX.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the private beta and start understanding your users better
            today.
          </p>
          <Button size="lg" className="gap-2">
            Join Private Beta
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
