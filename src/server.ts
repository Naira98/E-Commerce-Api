import path from "path";
import express from "express";
import config from "./config/config";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import { notFound } from "./controllers/not-found";
import { errorHandler } from "./middlewares/errors";

export const IMAGES_PATH = path.join(__dirname, "..", "public");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/assets", express.static(IMAGES_PATH));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});
