import { z } from "zod";

export const addProductSchema = z.object({
  name: z
    .string({ message: "Name must be a string" })
    .min(3, { message: "Name must be 3 or more characters long" })
    .max(50, { message: "Name must be 50 or fewer characters long" }),
  price: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number({ message: "Price must be a number" })
        .gt(0, { message: "Price must be greater than 0" })
    ),
  image: z.string({ message: "Image must be a string" }),
  quantity: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number({ message: "Quantity name must be a number" })
        .int({ message: "Quantity can't be decimal" })
        .nonnegative({ message: "Quantity must be non-negative value" })
    ),

  salePrice: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number({ message: "Sale price name must be a number" })
        .nonnegative({ message: "Sale Price must be non-negative value" })
    )
    .optional(),
});

export const updateProductSchema = addProductSchema.partial();
