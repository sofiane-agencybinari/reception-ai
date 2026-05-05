import { z } from "zod";

const uuidLike = z.string().regex(/^[0-9a-fA-F-]{36}$/);
const defaultRestaurantId = "11111111-1111-1111-1111-111111111111";

export const webhookOrderSchema = z.object({
  callId: z.string().min(1).optional(),
  transcript: z.string().optional(),
  restaurantId: z
    .string()
    .optional()
    .transform((value) =>
      value && uuidLike.safeParse(value).success ? value : defaultRestaurantId,
    ),
  customerPhone: z
    .string()
    .optional()
    .transform((value) => (value && value.trim().length >= 6 ? value.trim() : "+33000000000")),
  customerName: z.string().optional(),
  pickupTime: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        quantity: z.coerce.number().int().positive(),
        unitPrice: z.coerce.number().nonnegative(),
      }),
    )
    .min(1),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "new",
    "accepted",
    "preparing",
    "ready",
    "picked_up",
    "cancelled",
  ]),
});

export const menuItemSchema = z.object({
  restaurantId: uuidLike,
  name: z.string().min(1),
  price: z.number().nonnegative(),
  isAvailable: z.boolean().default(true),
});
