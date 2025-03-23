import mongoose, { Schema, Types } from "mongoose";


export interface IPost {
  title: string;
  content: string;
  owner: Types.ObjectId; 
  imageUrl?: string;
  numOfComments: number;
  numOfLikes: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// יצירת סכימה
const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    numOfComments: {
      type: Number,
      default: 0,
      min: [0, "numOfComments must be a positive integer"],
    },
    numOfLikes: {
      type: Number,
      default: 0,
      min: [0, "numOfLikes must be a positive integer"],
    },
  },
  {
    timestamps: true, // מוסיף createdAt ו-updatedAt אוטומטית
  }
);

// יצירת מודל
const PostModel = mongoose.model<IPost>("Post", postSchema);

export default PostModel;
