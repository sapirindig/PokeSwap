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
                ...req.body,
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
      

}

export default new PostsController();