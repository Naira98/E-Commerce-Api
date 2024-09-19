import { userPayload } from "./src/schemas/userSchemas";

declare module "express" {
  interface Request {
    user?: userPayload;
  }
}
