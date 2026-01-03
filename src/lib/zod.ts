import z from "zod";

export const tradingFormSchema = z.object({
  positionSize: z
    .string()
    .min(1, "Position size is required")
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
      message: "Position size must be a positive number",
    }),
  leverage: z
    .number()
    .min(1, "Leverage must be at least 1x")
    .max(50, "Leverage cannot exceed 50x"),
});

export type tradingFormSchemaType = z.infer<typeof tradingFormSchema>;
