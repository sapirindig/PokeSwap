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
exports.testUser = exports.app = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("../server"));
exports.app = server_1.default;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const testUser = {
    _id: "68036b6fa24839a1612b3ed8",
    token: "fake-test-token",
};
exports.testUser = testUser;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Connecting to test DB...");
    yield mongoose_1.default.connect(process.env.DB_CONNECTION);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Closing DB connection...");
    yield mongoose_1.default.connection.close();
}));
