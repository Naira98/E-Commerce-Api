import mongoose, { ObjectId, Schema, Document } from "mongoose";
import { IProductModel } from "./Product";

interface CartItem {
  product: IProductModel | ObjectId;
  quantity: number;
}

export interface ICart {
  userId: ObjectId;
  products: CartItem[];
}

export interface ICartModel extends ICart, Document<ObjectId> {}

const cartSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  }
);

export default mongoose.model<ICartModel>("Cart", cartSchema);
