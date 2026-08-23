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
import { MarketingMarquee } from "@/components/marketing/marketing-marquee";
import { MarketingPricing } from "@/components/marketing/marketing-pricing";
import { MarketingStats } from "@/components/marketing/marketing-stats";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingAmbient />
      <MarketingHeader />

      <main className="relative z-10">
        <MarketingHero />
        <div className="relative z-10 -mt-2">
          <MarketingStats />
        </div>
        <MarketingMarquee />
        <MarketingHowItWorks />
        <MarketingFeaturesBento />
        <MarketingGoogleReviews />
        <MarketingComparison />
        <MarketingPricing />
        <MarketingFaq />
        <MarketingCta />
      </main>

      <MarketingFooter />
    </div>
  );
}
