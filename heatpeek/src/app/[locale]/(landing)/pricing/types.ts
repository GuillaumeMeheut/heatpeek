import { z } from "zod";

export const checkoutSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  customerId: z.string().optional(),
  userEmail: z.string().email("A valid email is required"),
  priceId: z.string().min(1, "Price ID is required"),
});
