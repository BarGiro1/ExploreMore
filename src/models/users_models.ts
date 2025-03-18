import mongoose, { Schema } from "mongoose";

interface IUsers {
  userName: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const usersSchema = new Schema<IUsers>(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password : {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const UsersModel = mongoose.model<IUsers>("Users",usersSchema);

export default UsersModel;
