import express from "express";
import { isAuth } from "../middlewares/isAuth";
import { uploadProduct } from "../config/multer";
import {
  addProduct,
  deleteProduct,
  findAll,
  findProduct,
  updateProduct,
} from "../controllers/products";

const router = express.Router();

/* /api/products */

router.post("/", isAuth, uploadProduct.single("picture"), addProduct);

router.patch("/:productId", isAuth, updateProduct);

router.delete("/:productId", isAuth, deleteProduct);

router.get("/", findAll);

router.get("/:productId", findProduct);

export default router;
