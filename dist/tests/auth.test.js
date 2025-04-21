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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const posts_model_1 = __importDefault(require("../models/posts_model"));
const users_model_1 = __importDefault(require("../models/users_model"));
var app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("beforeAll");
    app = yield (0, server_1.default)();
    yield users_model_1.default.deleteMany();
    yield posts_model_1.default.deleteMany();
}));
afterAll((done) => {
    console.log("afterAll");
    mongoose_1.default.connection.close();
    done();
});
const baseUrl = "/auth";
const testUser = {
    email: "test@user.com",
    password: "testpassword",
};
describe("Auth Tests", () => {
    test("Auth test register", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/register").send(testUser);
        expect(response.statusCode).toBe(200);
    }));
    test("Auth test register fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/register").send(testUser);
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth test register fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/register").send({
            email: "sdsdfsd",
        });
        expect(response.statusCode).not.toBe(200);
        const response2 = yield (0, supertest_1.default)(app).post(baseUrl + "/register").send({
            email: "",
            password: "sdfsd",
        });
        expect(response2.statusCode).not.toBe(200);
    }));
    test("Auth test login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/login").send(testUser);
        expect(response.statusCode).toBe(200);
        const token = response.body.token;
        expect(token).toBeDefined();
        expect(response.body._id).toBeDefined();
        testUser.token = token;
        testUser._id = response.body._id;
    }));
    test("Auth test login fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/login").send({
            email: testUser.email,
            password: "sdfsd",
        });
        expect(response.statusCode).not.toBe(200);
        const response2 = yield (0, supertest_1.default)(app).post(baseUrl + "/login").send({
            email: "dsfasd",
            password: "sdfsd",
        });
        expect(response2.statusCode).not.toBe(200);
    }));
    test("Auth test me", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send({
            title: "Test Post",
            content: "Test Content",
            owner: "sdfSd",
        });
        expect(response.statusCode).not.toBe(201);
        const response2 = yield (0, supertest_1.default)(app).post("/posts").set({ authorization: "JWT " + testUser.token }).send({
            title: "Test Post",
            content: "Test Content",
            owner: "sdfSd",
        });
        expect(response2.statusCode).toBe(201);
    }));
});
