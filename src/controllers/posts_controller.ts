import postModel, { IPost } from "../models/posts_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";

class PostsController extends BaseController<IPost> {
    constructor() {
        super(postModel);
    }

    async create(req: Request, res: Response) {
        try {
            const userId = req.body.userId || req.params.userId;
    
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
    
}


export default new PostsController();