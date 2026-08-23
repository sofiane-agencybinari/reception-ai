"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { MarketingAmbient } from "@/components/marketing/marketing-ambient";
import { MarketingComparison } from "@/components/marketing/marketing-comparison";
import { MarketingCta } from "@/components/marketing/marketing-cta";
import { MarketingFaq } from "@/components/marketing/marketing-faq";
import { MarketingFeaturesBento } from "@/components/marketing/marketing-features-bento";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingGoogleReviews } from "@/components/marketing/marketing-google-reviews";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingHero } from "@/components/marketing/marketing-hero";
import { MarketingHowItWorks } from "@/components/marketing/marketing-how-it-works";
import { MarketingIntro } from "@/components/marketing/marketing-intro";
import { MarketingMarquee } from "@/components/marketing/marketing-marquee";
import { MarketingPricing } from "@/components/marketing/marketing-pricing";
import { MarketingStats } from "@/components/marketing/marketing-stats";
import { Reveal } from "@/components/marketing/reveal";

export function LandingPage() {
  const reduce = useReducedMotion();
  const [entered, setEntered] = useState(() => Boolean(reduce));

  const onEnter = useCallback(() => setEntered(true), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatePresence>
        {!entered ? <MarketingIntro key="intro" onEnter={onEnter} /> : null}
      </AnimatePresence>

      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.985 }}
        animate={entered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.985 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: entered ? 0.15 : 0 }}
      >
        <MarketingAmbient />
        <MarketingHeader ready={entered} />

        <main className="relative z-10">
          <MarketingHero ready={entered} />
          <Reveal>
            <MarketingStats />
          </Reveal>
          <MarketingMarquee />
          <Reveal>
            <MarketingHowItWorks />
          </Reveal>
          <Reveal>
            <MarketingFeaturesBento />
          </Reveal>
          <Reveal>
            <MarketingGoogleReviews />
          </Reveal>
          <Reveal>
            <MarketingComparison />
          </Reveal>
          <Reveal>
            <MarketingPricing />
          </Reveal>
          <Reveal>
            <MarketingFaq />
          </Reveal>
          <Reveal>
            <MarketingCta />
          </Reveal>
        </main>

        <MarketingFooter />
      </motion.div>
    </div>
  );
}
