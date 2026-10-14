"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchRestaurantSession, type RestaurantSession } from "@/lib/auth-accounts";
import { RestaurantProvider } from "@/lib/restaurant-context";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<RestaurantSession | null>(null);

  useEffect(() => {
    fetchRestaurantSession().then((current) => {
      if (current) setSession(current);
      else router.replace("/login");
    });
  }, [router]);

  if (!session) {
    return (
      <div className="cockpit flex min-h-screen items-center justify-center bg-background text-sm text-zinc-500">
        Verification acces…
      </div>
    );
  }

  return <RestaurantProvider session={session}>{children}</RestaurantProvider>;
}
