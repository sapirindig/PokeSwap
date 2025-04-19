"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
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
const postModel = mongoose_1.default.model("Posts", postSchema);
exports.default = postModel;
