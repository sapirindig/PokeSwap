"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comments_controller_1 = __importDefault(require("../controllers/comments_controller"));
const auth_controller_1 = require("../controllers/auth_controller");
/**
* @swagger
* tags:
*   name: Comments
*   description: The Comments API
*/
router.get("/", comments_controller_1.default.getAll.bind(comments_controller_1.default));
router.get("/:id", comments_controller_1.default.getById.bind(comments_controller_1.default));
router.post("/", auth_controller_1.authMiddleware, comments_controller_1.default.create.bind(comments_controller_1.default));
router.delete("/:id", auth_controller_1.authMiddleware, comments_controller_1.default.deleteItem.bind(comments_controller_1.default));
exports.default = router;
