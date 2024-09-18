import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IToken {
  userId: ObjectId;
  refreshToken: string;
}

export interface ITokenModel extends IToken, Document<ObjectId> {}

const tokenSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITokenModel>("Token", tokenSchema);
