import { MarketingComparison } from "@/components/marketing/marketing-comparison";
import { MarketingCta } from "@/components/marketing/marketing-cta";
import { MarketingFaq } from "@/components/marketing/marketing-faq";
import { MarketingFeaturesBento } from "@/components/marketing/marketing-features-bento";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingHero } from "@/components/marketing/marketing-hero";
import { MarketingHowItWorks } from "@/components/marketing/marketing-how-it-works";
import { MarketingMarquee } from "@/components/marketing/marketing-marquee";
import { MarketingPricing } from "@/components/marketing/marketing-pricing";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="marketing-grid pointer-events-none fixed inset-0 opacity-30" />

      <MarketingHeader />

      <main className="relative z-10">
        <MarketingHero />
        <MarketingMarquee />
        <MarketingHowItWorks />
        <MarketingFeaturesBento />
        <MarketingComparison />
        <MarketingPricing />
        <MarketingFaq />
        <MarketingCta />
      </main>

      <MarketingFooter />
    </div>
  );
}
