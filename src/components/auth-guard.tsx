"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  clearRestaurantSession,
  readRestaurantSession,
  type RestaurantSession,
} from "@/lib/auth-accounts";
import { RestaurantProvider } from "@/lib/restaurant-context";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<RestaurantSession | null>(null);

  useEffect(() => {
    const current = readRestaurantSession();
    if (!current) {
      clearRestaurantSession();
      router.replace("/login");
      return;
    }
    setSession(current);
  }, [router]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-zinc-500">
        Verification acces…
      </div>
    );
  }

  return <RestaurantProvider session={session}>{children}</RestaurantProvider>;
}
