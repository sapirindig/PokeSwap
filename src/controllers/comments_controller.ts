import commentsModel, { IComments } from "../models/comment_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";

class CommentsController extends BaseController<IComments> {
  async createComment(req: Request, res: Response) {
    try {
      const { comment, postId } = req.body;
      const owner = (req as any).user?._id || req.body.owner;

      if (!comment || !postId || !owner) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newComment = await this.model.create({ comment, postId, owner });
      res.status(201).json(newComment);
    } catch (err) {
      res.status(500).json({ error: "Failed to create comment" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { postId, owner } = req.query;

      let filter: any = {};
      if (postId) filter.postId = postId;
      if (owner) filter.owner = owner;

      const comments = await this.model.find(filter).sort({ createdAt: -1 });
      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  }
}

export default new CommentsController(commentsModel);
