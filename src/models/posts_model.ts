import mongoose from "mongoose";

export interface IPost {
  title: string;
  content: string;
  owner: string;
  image?: string; 
}

const postSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  content: String,
  owner: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "/postImages/image.jpg", 

  },
});

const postModel = mongoose.model<IPost>("Posts", postSchema);

export default postModel;
