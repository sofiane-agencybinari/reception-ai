"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import type { RestaurantSession } from "@/lib/auth-accounts";

const RestaurantContext = createContext<RestaurantSession | null>(null);

export function RestaurantProvider({
  session,
  children,
}: {
  session: RestaurantSession;
  children: ReactNode;
}) {
  const value = useMemo(() => session, [session]);
  return (
    <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>
  );
}

export function useRestaurant(): RestaurantSession {
  const ctx = useContext(RestaurantContext);
  if (!ctx) {
    throw new Error("useRestaurant doit etre utilise dans AuthGuard / RestaurantProvider");
  }
  return ctx;
}

export function useRestaurantOptional(): RestaurantSession | null {
  return useContext(RestaurantContext);
}
