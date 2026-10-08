"use client";

/** Atmosphère papier — profondeur, grain, lumière chaude. Pas de teal. */
export function MarketingAmbient() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Base pierre */}
      <div className="absolute inset-0 bg-[#ebe6de]" />

      {/* Voile vertical — plus clair en haut, plus dense en bas */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f5f1ea_0%,#ebe6de_38%,#e4ddd3_72%,#d9d0c4_100%)]" />

      {/* Lumière studio */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-8%,rgba(255,255,255,0.95),transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_12%_30%,rgba(92,42,54,0.06),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_88%_18%,rgba(107,93,77,0.09),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_105%,rgba(60,48,36,0.12),transparent_55%)]" />

      {/* Grille très fine */}
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(26,24,22,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(26,24,22,0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)",
        }}
      />

      {/* Grain papier */}
      <div
        className="absolute inset-0 opacity-[0.42] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
        }}
      />

      {/* Vignette douce */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(40,32,24,0.08)_100%)]" />
    </div>
  );
}
