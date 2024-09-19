import express from "express";
import { isAuth } from "../middlewares/isAuth";
import { addToCart, changeQuantity, checkout, deleteProduct, getCartDetailsAndTotals, addMoney } from "../controllers/cart";

const router = express.Router();

/* /api/cart */

router.post("/", isAuth, addToCart);

router.patch("/", isAuth, changeQuantity);

router.delete("/", isAuth, deleteProduct);

router.get("/", isAuth, getCartDetailsAndTotals);

router.post("/money", isAuth, addMoney);

router.post('/checkout', isAuth, checkout);

export default router;
