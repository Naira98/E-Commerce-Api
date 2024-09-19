import { z } from "zod";

export const addToCartAndChangeQuantitySchemaSchema = z.object({
  productId: z.string({ message: "Product Id must be a string" }),
  quantity: z
    .number({ message: "Quantity must be a number" })
    .gt(0, { message: "Quantity must be greater than 0" })
    .int({ message: "Quantity can't be decimal" }),
});

export const deleteProductSchema = addToCartAndChangeQuantitySchemaSchema.pick({
  productId: true,
});

export const addMoneySchema = z.object({
  amount: z
    .number({ message: "Amount must be a number" })
    .gt(0, { message: "Amount must be greater than 0" }),
});
