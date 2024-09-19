import express from "express";
import { isAuth } from "../middlewares/isAuth";
import {
  addToCart,
  changeQuantity,
  checkout,
  deleteProduct,
  getCartDetailsAndTotals,
  addMoney,
} from "../controllers/cart";
import { validateData } from "../middlewares/validation";
import {
  addMoneySchema,
  addToCartAndChangeQuantitySchemaSchema,
  deleteProductSchema,
} from "../schemas/cartSchemas";

const router = express.Router();

/* /api/cart */

router.post(
  "/",
  isAuth,
  validateData(addToCartAndChangeQuantitySchemaSchema),
  addToCart
);

router.patch(
  "/",
  isAuth,
  validateData(addToCartAndChangeQuantitySchemaSchema),
  changeQuantity
);

router.delete("/", isAuth, validateData(deleteProductSchema), deleteProduct);

router.get("/", isAuth, getCartDetailsAndTotals);

router.post("/money", isAuth, validateData(addMoneySchema), addMoney);

router.post("/checkout", isAuth, checkout);

export default router;
