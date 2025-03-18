import mongoose, { Schema, Types } from "mongoose";

interface ILikes {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const likesSchema = new Schema<ILikes>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,  
      ref:"Post",
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const LikesModel = mongoose.model<ILikes>("Likes", likesSchema);

export default LikesModel;
