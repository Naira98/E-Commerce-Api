import path from "path";
import multer, { FileFilterCallback } from "multer";
import { nanoid } from "nanoid";
import { PRODUCTS_IMAGE_PATH } from "../server";
import { Request } from "express";

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(PRODUCTS_IMAGE_PATH, "products"));
  },

  filename: (req, file, cb) => {
    const randomName = nanoid() + path.extname(file.originalname);
    cb(null, randomName);
    req.body.image = "/products/" + randomName;
  },
});

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(PRODUCTS_IMAGE_PATH, "profiles"));
  },

  filename: (req, file, cb) => {
    const randomName = nanoid() + path.extname(file.originalname);
    cb(null, randomName);
    req.body.image = "/profiles/" + randomName;
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
    return cb(new Error("Only images are allowed"));
  }
  cb(null, true);
};

export const uploadProduct = multer({
  storage: productStorage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024,
  },
});

export const uploadProfile = multer({
  storage: profileStorage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024,
  },
});
