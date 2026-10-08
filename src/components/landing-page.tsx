"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

import { MarketingAmbient } from "@/components/marketing/marketing-ambient";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingHero } from "@/components/marketing/marketing-hero";
import { MarketingIntro } from "@/components/marketing/marketing-intro";
import { MarketingScrollStory } from "@/components/marketing/marketing-scroll-story";
import { Compare } from "@/components/immersive/compare";
import { DayTimeline } from "@/components/immersive/day-timeline";
import { Faq } from "@/components/immersive/faq";
import { OrbJourney } from "@/components/immersive/orb-journey";
import { LuxeFooter } from "@/components/immersive/finale";
import { LiveDemo } from "@/components/immersive/live-demo";
import { SubscribeProvider } from "@/components/immersive/subscribe-panel";
import { Pricing } from "@/components/immersive/pricing";
import { SmoothScroll } from "@/components/immersive/smooth-scroll";

/**
 * Landing — preloader → hero salle → récit iPhone 3D (début Cursor conservé),
 * puis sections sobres et animées : journée type → capacités → avant/avec → tarifs → FAQ → démo vocale en direct.
 */
export function LandingPage() {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [introGone, setIntroGone] = useState(false);

  useEffect(() => {
    if (reduce) {
      setReady(true);
      setIntroGone(true);
    }
  }, [reduce]);

  const onReveal = useCallback(() => setReady(true), []);
  const onIntroComplete = useCallback(() => setIntroGone(true), []);

  return (
    <SubscribeProvider>
    <div className="lx min-h-screen bg-[#ebe6de] text-[#1a1816]">
      <SmoothScroll locked={!introGone} />
      {!reduce && !introGone ? (
        <MarketingIntro onReveal={onReveal} onComplete={onIntroComplete} />
      ) : null}
      <MarketingAmbient />
      <MarketingHeader ready={ready} />

      <main className="relative z-10">
        <MarketingHero ready={ready} />
        <MarketingScrollStory />
        <DayTimeline />
        <OrbJourney />
        <Compare />
        <Pricing />
        <Faq />
        <LiveDemo />
      </main>

      <LuxeFooter />
    </div>
    </SubscribeProvider>
  );
}
