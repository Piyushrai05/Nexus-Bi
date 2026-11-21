"use client";

import React from "react";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingWorkflow } from "@/components/landing/landing-workflow";
import { LandingDemo } from "@/components/landing/landing-demo";
import { LandingFAQ } from "@/components/landing/landing-faq";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <LandingHero />
      <LandingFeatures />
      <LandingWorkflow />
      <LandingDemo />
      <LandingFAQ />
      <LandingFooter />
    </div>
  );
}
