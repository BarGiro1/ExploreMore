import mongoose, { Schema } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  refreshToken?: string[];
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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
    refreshToken: {
      type: [String],  // מערך של מחרוזות
      default: [],     // ברירת מחדל היא מערך ריק
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model<IUser>("Users", userSchema);

export default userModel;
