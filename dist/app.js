"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const port = process.env.PORT;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("1");
(0, server_1.default)().then((app) => {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
});
