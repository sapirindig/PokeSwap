"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const posts_routes_1 = __importDefault(require("./routes/posts_routes"));
const comments_routes_1 = __importDefault(require("./routes/comments_routes"));
const auth_routes_1 = __importDefault(require("./routes/auth_routes"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/posts", posts_routes_1.default);
app.use("/comments", comments_routes_1.default);
app.use("/auth", auth_routes_1.default);
const db = mongoose_1.default.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));
const initApp = () => {
    return new Promise((resolve, reject) => {
        if (!process.env.DB_CONNECT) {
            reject("DB_CONNECT is not defined in .env file");
        }
        else {
            mongoose_1.default
                .connect(process.env.DB_CONNECT)
                .then(() => {
                resolve(app);
            })
                .catch((error) => {
                reject(error);
            });
        }
    });
};
exports.default = initApp;
