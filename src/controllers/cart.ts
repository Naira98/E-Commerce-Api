import { NextFunction, Request, Response } from "express";
import Product, { IProductModel } from "../models/Product";
import Cart, { ICartModel } from "../models/Cart";
import { DELIVERY_FEES, TAX } from "../lib/contants";

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Invalid product" });

    const cart = await Cart.findOne({ userId: req.user?.userId }).select(
      "-cretedAt -updatedAt"
    );
    let savedCart: ICartModel;

    if (cart) {
      const products = cart.products;
      const cartProductIndex = products.findIndex(
        (p) => p.product.toString() === productId.toString()
      );

      if (cartProductIndex >= 0) {
        cart.products[cartProductIndex].quantity += Number(quantity);
      } else {
        cart.products.push({
          product: productId,
          quantity: Number(quantity),
        });
      }
      savedCart = await cart.save();
    } else {
      const newCart = new Cart({
        userId: req.user?.userId,
        products: [{ product: productId, quantity: Number(quantity) }],
      });
      savedCart = await newCart.save();
    }
    return res.status(201).json(savedCart);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const changeQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user?.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const products = cart.products;
    const cartProductIndex = products.findIndex(
      (p) => p.product.toString() === productId.toString()
    );

    if (cartProductIndex <= -1)
      return res.status(404).json({ message: "Product not in the cart" });

    cart.products[cartProductIndex].quantity = Number(quantity);
    const updatedCart = await cart.save();

    return res.status(200).json(updatedCart);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ userId: req.user?.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const cartProductIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (cartProductIndex < 0) return res.status(404).json("Product not found");

    cart.products.splice(cartProductIndex, 1);
    const updatedCart = await cart.save();

    return res.status(200).json(updatedCart);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getCartDetailsAndTotals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cart = await Cart.findOne({ userId: req.user?.userId }).populate(
      "products.product"
    );
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    console.log(cart);

    let subtotal = 0;
    cart.products.map((p) => {
      const product = p.product as IProductModel;
      subtotal = product.salePrice
        ? subtotal + Number(product.salePrice) * Number(p.quantity)
        : subtotal + Number(product.price) * Number(p.quantity);
    });
    subtotal = Math.round(subtotal);
    const total = Math.round(subtotal + DELIVERY_FEES + subtotal * TAX);

    return res.status(200).json({ cart, subtotal, total });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
export const checkout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cart = await Cart.findOne({ userId: req.user?.userId });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
