import { Request, Response } from "express";
import Post from "../models/posts_model";


export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { owner } = req.query;
    const filter = owner ? { owner } : {};
    const posts = await Post.find(filter);
    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json(post);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


export const createPost = async (req: Request, res: Response): Promise<void> => {
  console.log("POST request received at /posts");
  console.log("Body:", req.body);

  try {
    const newPost = await Post.create(req.body);
    res.status(201).json(newPost);
  } catch (err: any) {
    console.error("Error creating post:", err.message);
    res.status(400).json({ message: err.message });
  }
};


export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json({ message: "Post deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
