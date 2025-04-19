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
const mongoose = require("mongoose");
const app = require("../server");
require("dotenv").config();
const testUser = {
    _id: "68036b6fa24839a1612b3ed8",
    token: "fake-test-token",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Connecting to test DB...");
    yield mongoose.connect(process.env.DB_CONNECTION);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Closing DB connection...");
    yield mongoose.connection.close();
}));
module.exports = { app, testUser };
