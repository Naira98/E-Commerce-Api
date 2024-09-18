import express from "express";
import { uploadProfile } from "../config/multer";
import { isAuth } from "../middlewares/isAuth";
import { login, logout, refresh, reigster } from "../controllers/auth";

const router = express.Router();

/* /api/auth */

router.post("/register", uploadProfile.single("picture"), reigster);

router.post("/login", login);

router.post("/refresh", refresh);

router.post("/logout", isAuth, logout);

export default router;
