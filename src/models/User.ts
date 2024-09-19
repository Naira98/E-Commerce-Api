import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  image: string;
  wallet: number;
}

export interface IUserModel extends IUser, Document<ObjectId> {}

const userSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    wallet: {
      type: Number,
      default: 0,
      min: [0, "Wallet ca't be less than 0"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUserModel>("User", userSchema);
