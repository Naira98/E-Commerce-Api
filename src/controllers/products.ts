import fs from "fs";
import path from "path";
import { NextFunction, Request, Response } from "express";
import Product from "../models/Product";
import { IMAGES_PATH } from "../server";

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, image, quantity, salePrice } = req.body;
    const newProduct = new Product({
      name,
      price,
      image,
      quantity,
      salePrice,
      postedBy: req.user?.userId,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.user?.userId !== product.postedBy.toString())
      return res.status(403).json({ message: "Forbidden" });

    product.set(req.body);
    const updatedProduct = await product.save();
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    // const product = await Product.findOne({
    //   _id: productId,
    //   postedBy: req.user?.userId,
    // });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.postedBy.toString() !== req.user?.userId)
      return res.status(403).json({ message: "Forbidden" });

    const image = product.image;
    await product.deleteOne();
    deleteImage(image);

    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const findProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteImage = (image: string) => {
  fs.unlink(path.join(IMAGES_PATH, image), (err) => {
    if (err) console.log(err);
  });
};
