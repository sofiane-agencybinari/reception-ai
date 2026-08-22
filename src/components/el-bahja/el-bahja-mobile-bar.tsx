import { Phone } from "lucide-react";

import { EL_BAHJA } from "@/lib/el-bahja";

export function ElBahjaMobileBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background/90 p-4 backdrop-blur-xl md:hidden">
      <a
        href={`tel:${EL_BAHJA.phone}`}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-astor-accent py-3.5 text-sm font-semibold text-white transition hover:bg-astor-accent-soft"
      >
        <Phone className="h-4 w-4" />
        Commander — {EL_BAHJA.phoneDisplay}
      </a>
    </div>
  );
}
