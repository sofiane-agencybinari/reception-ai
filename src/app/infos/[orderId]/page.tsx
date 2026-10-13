import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isValidCustomerLink } from "@/lib/customer-link";
import { getSupabaseAdminClient } from "@/lib/supabase";

import { CustomerInfoForm } from "./customer-info-form";

export const metadata: Metadata = { title: "Vos informations", robots: { index: false, follow: false } };

type Props = { params: Promise<{ orderId: string }>; searchParams: Promise<{ s?: string }> };

/** Page ouverte depuis le SMS de confirmation : le client complète sa fiche s'il le souhaite. */
export default async function CustomerInfoPage({ params, searchParams }: Props) {
  const { orderId } = await params;
  const { s } = await searchParams;
  if (!isValidCustomerLink(orderId, s)) notFound();

  const supabase = getSupabaseAdminClient();
  const { data: order } = supabase
    ? await supabase.from("orders").select("customer_name, restaurants(name)").eq("id", orderId).maybeSingle()
    : { data: null };
  if (!order) notFound();

  const restaurants = order.restaurants as { name?: string } | { name?: string }[] | null;
  const restaurant = (Array.isArray(restaurants) ? restaurants[0]?.name : restaurants?.name) ?? "votre restaurant";

  return (
    <main className="min-h-screen bg-[#f3f0ed] px-5 py-14 text-[#1a1816]">
      <div className="mx-auto max-w-md">
        <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.22em] text-[#5c2a36]">{restaurant}</p>
        <h1 className="mt-3 font-sans text-[2rem] font-medium leading-[1.05] tracking-[-0.04em]">Merci pour votre commande.</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[#4a453f]">
          Complétez vos informations si vous le souhaitez : {restaurant} vous reconnaîtra à votre prochaine commande et pourra vous
          envoyer ses offres si vous l’acceptez. Tous les champs sont facultatifs.
        </p>
        <CustomerInfoForm orderId={orderId} signature={s ?? ""} restaurant={restaurant} defaultFirstName={order.customer_name ?? ""} />
      </div>
    </main>
  );
}
