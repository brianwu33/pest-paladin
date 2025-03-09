"use client";

import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bell, BarChart, Camera } from "lucide-react";
import TypingEffect from "@/components/TypingEffect"; // Import TypingEffect

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
        {/* App Name */}
        <div className="absolute top-6 left-8 text-2xl font-bold text-primary">
          Pest Paladin
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <TypingEffect
            text="Protect Your Space with &lt;Pest Paladin /&gt;"
            speed={75}
            as="h1"
            className="text-4xl font-bold tracking-tight text-primary"
          />
          <p className="mt-4 text-lg text-muted-foreground">
            AI-powered pest detection for a safer environment. Get real-time
            alerts and monitor your space with ease.
          </p>

          {/* Clerk Auth Buttons */}
          <div className="mt-6 flex gap-4 justify-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="px-6 text-lg">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button size="lg" variant="outline" className="px-6 text-lg">
                Log In
              </Button>
            </SignInButton>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
          <FeatureCard
            icon={<Bell className="mx-auto h-12 w-12 text-primary" />}
            title="Real-time Alerts"
            description="Get instant notifications when pests are detected in your area."
          />
          <FeatureCard
            icon={<BarChart className="mx-auto h-12 w-12 text-primary" />}
            title="Smart Insights"
            description="AI-driven analytics help you track pest trends and take action."
          />
          <FeatureCard
            icon={<Camera className="mx-auto h-12 w-12 text-primary" />}
            title="Remote Monitoring"
            description="Check camera feeds and reports from anywhere, anytime."
          />
        </div>
      </div>
    </>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 border rounded-xl shadow-sm">
      {icon}
      <h3 className="text-xl font-semibold mt-4">{title}</h3>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  );
}
