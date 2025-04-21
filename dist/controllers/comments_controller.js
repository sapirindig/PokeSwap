"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comment_model_1 = __importDefault(require("../models/comment_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const commentsController = new base_controller_1.default(comment_model_1.default);
exports.default = commentsController;
