import mongoose from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  _id?: string;
  refreshToken?: string[];
  imageUrl?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
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
  refreshToken: {
    type: [String],
    default: [],
  },
  imageUrl: {
    type: String,
    default: "/uploads/pokeball.png", 
  },
});

const userModel = mongoose.model<IUser>("Users", userSchema);

export default userModel;