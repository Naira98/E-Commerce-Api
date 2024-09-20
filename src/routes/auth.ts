import express from "express";
import { uploadProfile } from "../config/multer";
import { isAuth } from "../middlewares/isAuth";
import { login, logout, refresh, register } from "../controllers/auth";
import { validateData } from "../middlewares/validation";
import {
  loginSchema,
  refreshSchema,
  registerSchema,
} from "../schemas/authSchemas";

const router = express.Router();

/* /api/auth */

router.post(
  "/register",
  uploadProfile.single("picture"),
  validateData(registerSchema),
  register
);

router.post("/login", validateData(loginSchema), login);

router.post("/refresh", validateData(refreshSchema), refresh);

router.post("/logout", isAuth, logout);

export default router;
