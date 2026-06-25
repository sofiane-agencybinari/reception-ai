"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AUTH_STORAGE_KEY = "reception_ai_authenticated";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ok = window.sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
    if (!ok) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <p className="text-sm text-slate-600">Verification acces...</p>;
  }

  return <>{children}</>;
}
