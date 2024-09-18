import jwt from "jsonwebtoken";
import { userPayload } from "../schemas/userSchemas";
import config from "../config/config";

export const generateAccessToken = (data: userPayload) => {
  return jwt.sign(data, config.jwt.accessSecret, { expiresIn: "5m" });
};

export const generateRefreshToken = (data: userPayload) => {
  return jwt.sign(data, config.jwt.refreshSecret);
};
