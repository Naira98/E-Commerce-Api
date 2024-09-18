import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../lib/helpers";
import Token from "../models/Token";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { userPayload } from "../schemas/userSchemas";

export const reigster = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password, phone, image } = req.body;
    const user = await User.findOne({ email });
    if (user) res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      image,
    });
    const addedUser = await newUser.save();

    return res.status(201).json(addedUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("-createdAt -updatedAt");
    if (!user) return res.status(400).json({ message: "Bad Credentials" });

    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) return res.status(400).json({ message: "Bad Credentials" });

    const accessToken = generateAccessToken({ userId: user._id.toString() });
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    await Token.findOneAndUpdate(
      { userId: user._id },
      { $set: { userId: user._id ,refreshToken } },
      { upsert: true }
    );

    return res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;
    const tokenInDB = await Token.findOne({ refreshToken });
    if (!tokenInDB) return res.status(401).json({ message: "Invalid Token" });

    const user = jwt.verify(
      refreshToken,
      config.jwt.refreshSecret
    ) as userPayload;

    const newAccessToken = generateAccessToken({ userId: user.userId });

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Token.findOneAndDelete({ userId: req.user?.userId });
    return res.status(200).json({message: "Logged Out"})
  } catch (error) {
    console.log(error);
    next(error);
  }
};
