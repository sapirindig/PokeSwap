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
          const postId = req.params.id;
          const userId = (req as any).user._id;
          const { title, content } = req.body;
      
          const imagePath = req.file ? `postImages/${req.file.filename.replace(/\\/g, "/")}` : undefined;
      
          const updatedPost = await postModel.findOneAndUpdate(
            { _id: postId, owner: userId },
            {
              ...(title && { title }),
              ...(content && { content }),
              ...(imagePath && { image: imagePath })
            },
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

}

export default new PostsController();