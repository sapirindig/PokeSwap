"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.createPost = exports.getPostById = exports.getAllPosts = void 0;
const posts_model_1 = __importDefault(require("../models/posts_model"));
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { owner } = req.query;
        const filter = owner ? { owner } : {};
        const posts = yield posts_model_1.default.find(filter);
        res.json(posts);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getAllPosts = getAllPosts;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield posts_model_1.default.findById(req.params.id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.json(post);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getPostById = getPostById;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("POST request received at /posts");
    console.log("Body:", req.body);
    try {
        const newPost = yield posts_model_1.default.create(req.body);
        res.status(201).json(newPost);
    }
    catch (err) {
        console.error("Error creating post:", err.message);
        res.status(400).json({ message: err.message });
    }
});
exports.createPost = createPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield posts_model_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.json({ message: "Post deleted" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.deletePost = deletePost;
