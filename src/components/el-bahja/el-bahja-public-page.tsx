import type { MenuCategory, MenuItemRow } from "@/lib/menu-categories";

import { ElBahjaCtaBand } from "@/components/el-bahja/el-bahja-cta-band";
import { ElBahjaFaq } from "@/components/el-bahja/el-bahja-faq";
import { ElBahjaFeatures } from "@/components/el-bahja/el-bahja-features";
import { ElBahjaFooter } from "@/components/el-bahja/el-bahja-footer";
import { ElBahjaHeader } from "@/components/el-bahja/el-bahja-header";
import { ElBahjaHero } from "@/components/el-bahja/el-bahja-hero";
import { ElBahjaInfos } from "@/components/el-bahja/el-bahja-infos";
import { ElBahjaMenuSection } from "@/components/el-bahja/el-bahja-menu-section";
import { ElBahjaMobileBar } from "@/components/el-bahja/el-bahja-mobile-bar";
import { ElBahjaStats } from "@/components/el-bahja/el-bahja-stats";
import { ElBahjaSteps } from "@/components/el-bahja/el-bahja-steps";

type Props = {
  groupedMenu: Record<MenuCategory, MenuItemRow[]>;
  itemCount: number;
  menuError?: string | null;
};

export function ElBahjaPublicPage({ groupedMenu, itemCount, menuError }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="marketing-grid pointer-events-none fixed inset-0 opacity-30" />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-astor-accent/8 blur-[120px]" />
        <div className="absolute -right-32 top-1/3 h-[300px] w-[400px] rounded-full bg-teal-900/20 blur-[100px]" />
      </div>

      <ElBahjaHeader />

      <main className="relative z-10 pb-24 md:pb-0">
        <ElBahjaHero />
        <ElBahjaStats itemCount={itemCount} />
        <ElBahjaSteps />
        <ElBahjaFeatures />
        <ElBahjaMenuSection
          groupedMenu={groupedMenu}
          itemCount={itemCount}
          menuError={menuError}
        />
        <ElBahjaInfos />
        <ElBahjaFaq />
        <ElBahjaCtaBand />
      </main>

      <ElBahjaFooter />
      <ElBahjaMobileBar />
    </div>
  );
}
