import path from "path";
import express from "express";
import config from "./config/config";
import mongoose from "mongoose";
import { userPayload } from "./schemas/userSchemas";
import authRoutes from "./routes/auth";

declare module "express" {
  interface Request {
    user?: userPayload;
  }
}

const app = express();

export const PRODUCTS_IMAGE_PATH = path.join(
  __dirname,
  "..",
  "public",
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/assets", express.static(PRODUCTS_IMAGE_PATH));

app.use("/api/auth", authRoutes);

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});
