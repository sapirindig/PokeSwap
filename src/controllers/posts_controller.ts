import postModel, { IPost } from "../models/posts_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";

class PostsController extends BaseController<IPost> {
    constructor() {
        super(postModel);
    }

    async create(req: Request, res: Response) {
        try {
          
          const userId = (req as any).user._id;

            const imagePath = req.file ? `postImages/${req.file.filename.replace(/\\/g, "/")}` : "postImages/image.jpg";
    
            const post = {
              title: req.body.title,
              content: req.body.content,
              image: imagePath,
              owner: userId
          };
          
    
            const newPost = await postModel.create(post);
            res.status(201).json(newPost);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
          const posts = await postModel.find(); 
          res.status(200).json(posts);
        } catch (err) {
          res.status(500).json({ error: "Failed to get posts" });
        }
      }
      

      async getMyPosts(req: Request, res: Response) {
        try {
          const userId = (req as any).user._id; 
          const posts = await postModel.find({ owner: userId });
          res.status(200).json(posts);
        } catch (err) {
          res.status(500).json({ error: "Failed to get user's posts" });
        }
      }

      async updatePost(req: Request, res: Response) {
        try {
          console.log("BODY:", req.body);
          const postId = req.params.id;
          const userId = (req as any).user._id;
      
          const title = req.body.title || "";
          const content = req.body.content || "";
      
          const updatedFields: any = {};
          if (title) updatedFields.title = title;
          if (content) updatedFields.content = content;
      
          if (req.file) {
            updatedFields.image = `postImages/${req.file.filename.replace(/\\/g, "/")}`;
          }
      
          const updatedPost = await postModel.findOneAndUpdate(
            { _id: postId, owner: userId },
            updatedFields,
            { new: true }
          );
      
          if (!updatedPost) {
            return res.status(404).json({ message: "Post not found or unauthorized" });
          }
      
          res.status(200).json(updatedPost);
        } catch (err) {
          res.status(500).json({ error: "Failed to update post" });
        }
      }
      

      async deleteItem(req: Request, res: Response): Promise<void> {
        try {
          const postId = req.params.id;
          const userId = (req as any).user._id;
      
          const deletedPost = await postModel.findOneAndDelete({
            _id: postId,
            owner: userId,
          });
      
          if (!deletedPost) {
            res.status(404).json({ message: "Post not found or not owned by user" });
            return;
          }
      
          res.status(200).json({ message: "Post deleted successfully" });
        } catch (err) {
          res.status(500).json({ error: "Failed to delete post" });
        }
      }
      
      getPostById = async (req: Request, res: Response) => {
        try {
          const postId = req.params.id;
          const userId = (req as any).user?._id?.toString();
      
          const post = await postModel.findById(postId);
          if (!post) return res.status(404).json({ message: "Post not found" });
      
          let liked = false;
          if (userId && post.likedBy?.map(id => id.toString()).includes(userId)) {
            liked = true;
          }
      
          res.status(200).json({ ...post.toObject(), liked });
        } catch (err) {
          res.status(500).json({ error: "Failed to get post" });
        }
      }      

      async likePost(req: Request, res: Response) {
        try {
          const postId = req.params.id;
          const user = (req as any).user;
      
          if (!postId || !user || !user._id) {
            return res.status(400).json({ message: "Missing postId or user info" });
          }
      
          const userId = user._id.toString();
          const post = await postModel.findById(postId);
          if (!post) return res.status(404).json({ message: "Post not found" });
      
          const likedByStrings = post.likedBy?.map(id => id.toString()) || [];
      
          if (likedByStrings.includes(userId)) {
            return res.status(400).json({ message: "You already liked this post" });
          }
      
          post.likedBy?.push(userId);
          post.likesCount = (post.likesCount || 0) + 1;
          await post.save();
      
          res.status(200).json(post);
        } catch (err) {
          console.error("Like error:", err);
          res.status(500).json({ error: "Failed to like post" });
        }
      }      
      
      async unlikePost(req: Request, res: Response) {
        try {
          const postId = req.params.id;
          const user = (req as any).user;
      
          if (!user || !user._id || !postId) {
            return res.status(400).json({ message: "Missing user or post ID" });
          }
      
          const userId = user._id.toString();
      
          const post = await postModel.findById(postId);
          if (!post) {
            return res.status(404).json({ message: "Post not found" });
          }
      
          const likedByStrings = post.likedBy?.map(id => id.toString()) || [];
      
          if (!likedByStrings.includes(userId)) {
            return res.status(400).json({ message: "You have not liked this post" });
          }
      
          post.likedBy = post.likedBy?.filter(id => id.toString() !== userId);
          post.likesCount = Math.max((post.likesCount || 1) - 1, 0);
          await post.save();
      
          res.status(200).json(post);
        } catch (err) {
          console.error("Unlike error:", err);
          res.status(500).json({ error: "Failed to unlike post" });
        }
      }      
      
}

export default new PostsController();