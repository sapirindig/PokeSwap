import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
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
    default: "",
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  likedBy: {
    type: [String],
    default: [],
  },
});

const postModel = mongoose.model("Posts", postSchema);

export default postModel;
