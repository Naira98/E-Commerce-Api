import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { DELIVERY_FEES, TAX } from "../lib/contants";
import Product, { IProductModel } from "../models/Product";
import Cart, { ICartModel } from "../models/Cart";
import User from "../models/User";

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Invalid product" });

    if (quantity > product.quantity)
      return res.status(400).json({ message: "This quantity not available" });

    const cart = await Cart.findOne({ userId: req.user?.userId });
    let savedCart: ICartModel;

    if (cart) {
      const products = cart.products;
      const cartProductIndex = products.findIndex(
        (p) => p.product.toString() === productId.toString()
      );

      if (cartProductIndex >= 0) {
        if (
          cart.products[cartProductIndex].quantity + Number(quantity) >
          product.quantity
        )
          return res.status(400).json({ message: "Quantity unavailable" });
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
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const changeQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Invalid product" });
    if (quantity > product.quantity)
      return res.status(400).json({ message: "This quantity not available" });

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
  } catch (error) {
    console.log(error);
    next(error);
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

    let subtotal = 0;
    cart.products.map((p) => {
      const product = p.product as IProductModel;
      subtotal = product.salePrice
        ? subtotal + Number(product.salePrice) * Number(p.quantity)
        : subtotal + Number(product.price) * Number(p.quantity);
    });
    subtotal = Math.round(subtotal);
    let total = Math.round(subtotal + subtotal * TAX);
    total = total === 0 ? 0 : total + DELIVERY_FEES;

    return res.status(200).json({ cart, subtotal, total });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const addMoney = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount } = req.body;
    if (amount < 0)
      return res.status(400).json({ message: "You ca't add negative amount" });

    await User.findByIdAndUpdate(req.user?.userId, {
      $inc: { wallet: Number(amount) },
    });
    return res.status(200).json({ message: "Money added successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const checkout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      /* CART */
      const cart = await Cart.findOne({ userId: req.user?.userId }).session(
        session
      );
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      /* PRODUCTS */

      if (cart.products.length === 0)
        return res
          .status(400)
          .json({
            message: "Your cart is empty, Go shopping first before checking out.",
          });
          
      let subtotal = 0;
      await Promise.all(
        cart.products.map(async (cartProd) => {
          /* Get Product */
          const product = await Product.findById(cartProd.product).session(
            session
          );
          if (!product)
            return res.status(404).json({ message: "Product not found" });

          /* Check Product quantity */
          if (cartProd.quantity > product.quantity)
            return res.status(406).json({
              message: `The quantity of ${product.name} not available`,
            });

          /* Calculate subtotal */
          subtotal = product.salePrice
            ? subtotal + Number(product.salePrice) * Number(cartProd.quantity)
            : subtotal + Number(product.price) * Number(cartProd.quantity);
        })
      );

      let total = Math.round(subtotal + subtotal * TAX);
      total = total ? total + DELIVERY_FEES : 0;

      /* USER */
      const user = await User.findById(req.user?.userId).session(session);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.wallet < total)
        return res.status(400).json({
          message: `No enough money. You need $${total} to complete your order`,
        });

      /* UPDATES */
      user.wallet -= total;
      const products = cart.products;
      cart.products = [];

      await Promise.all([
        user.save({ session }),
        cart.save({ session }),

        ...products.map((p) =>
          Product.updateOne(
            { _id: p.product },
            { $inc: { quantity: -p.quantity } },
            { session }
          ).session(session)
        ),
      ]);
      return res
        .status(200)
        .json({ message: `Checkout successfully done, total: $${total}` });
    });
    session.endSession();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
