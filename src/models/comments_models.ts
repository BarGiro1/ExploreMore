import mongoose, { Schema,Types } from "mongoose";

interface IComments {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const commentsSchema = new Schema<IComments>(
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
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const CommentsModel = mongoose.model<IComments>("Comments", commentsSchema);

export default CommentsModel;
