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
const posts_model_1 = __importDefault(require("../models/posts_model"));
const setupTests_1 = require("./setupTests");
let postId = "";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("beforeAll posts.test.ts");
    yield posts_model_1.default.deleteMany();
}));
afterAll(() => {
    console.log("afterAll");
});
describe("Posts Tests", () => {
    test("GET all posts (should be empty)", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(setupTests_1.app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    }));
    test("Create Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(setupTests_1.app)
            .post("/posts")
            .set("Authorization", `Bearer ${setupTests_1.testUser.token}`)
            .send({
            title: "Test Post",
            content: "Test Content",
            owner: setupTests_1.testUser._id,
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe("Test Post");
        expect(response.body.content).toBe("Test Content");
        postId = response.body._id;
    }));
    test("GET posts by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(setupTests_1.app).get(`/posts?owner=${setupTests_1.testUser._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].owner).toBe(setupTests_1.testUser._id);
    }));
    test("GET post by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(setupTests_1.app).get(`/posts/${postId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    }));
    test("Create second Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(setupTests_1.app)
            .post("/posts")
            .set("Authorization", `Bearer ${setupTests_1.testUser.token}`)
            .send({
            title: "Test Post 2",
            content: "Test Content 2",
            owner: setupTests_1.testUser._id,
        });
        expect(response.statusCode).toBe(201);
    }));
    test("GET all posts (should have 2)", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(setupTests_1.app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);
    }));
    test("Delete Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(setupTests_1.app)
            .delete(`/posts/${postId}`)
            .set("Authorization", `Bearer ${setupTests_1.testUser.token}`);
        expect(response.statusCode).toBe(200);
        const check = yield (0, supertest_1.default)(setupTests_1.app).get(`/posts/${postId}`);
        expect(check.statusCode).toBe(404);
    }));
    test("Fail to create post without required fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(setupTests_1.app)
            .post("/posts")
            .set("Authorization", `Bearer ${setupTests_1.testUser.token}`)
            .send({
            content: "Missing title and owner",
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Create post with image and like data", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(setupTests_1.app)
            .post("/posts")
            .set("Authorization", `Bearer ${setupTests_1.testUser.token}`)
            .send({
            title: "Post with image and likes",
            content: "Some content here",
            owner: setupTests_1.testUser._id,
            image: "https://example.com/image.png",
            likesCount: 1,
            likedBy: [setupTests_1.testUser._id],
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.image).toBe("https://example.com/image.png");
        expect(response.body.likesCount).toBe(1);
        expect(response.body.likedBy).toContain(setupTests_1.testUser._id);
    }));
    test("Check post defaults when fields are missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(setupTests_1.app)
            .post("/posts")
            .set("Authorization", `Bearer ${setupTests_1.testUser.token}`)
            .send({
            title: "Post with defaults",
            content: "Only basic data",
            owner: setupTests_1.testUser._id,
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.image).toBe("");
        expect(response.body.likesCount).toBe(0);
        expect(response.body.likedBy).toEqual([]);
    }));
});
