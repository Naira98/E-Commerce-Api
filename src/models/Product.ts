import mongoose, { ObjectId, Schema, Document } from "mongoose";

export interface IProduct {
  name: string;
  price: number;
  image: string;
  quantity: number;
  salePrice: number;
  postedBy: ObjectId;
}

export interface IProductModel extends IProduct, Document<ObjectId> {}

const productSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be greater than 0"],
    },
    image: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity can't be less than 0"],
    },
    salePrice: {
      type: Number,
      default: 0,
      min: [0, "salePrice must be greater than 0"]
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProductModel>("Product", productSchema);
