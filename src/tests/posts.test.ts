import request, { Response as SupertestResponse } from "supertest";
import postModel from "../models/posts_model";
import { app, testUser } from "./setupTests";

let postId: string = "";

beforeAll(async (): Promise<void> => {
  console.log("beforeAll posts.test.ts");
  await postModel.deleteMany();
});

afterAll((): void => {
  console.log("afterAll");
});

describe("Posts Tests", () => {
  test("GET all posts (should be empty)", async (): Promise<void> => {
    const response: SupertestResponse = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Create Post", async (): Promise<void> => {
    const response = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${testUser.token}`)
      .send({
        title: "Test Post",
        content: "Test Content",
        owner: testUser._id,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
    postId = response.body._id;
  });

  test("GET posts by owner", async (): Promise<void> => {
    const response = await request(app).get(`/posts?owner=${testUser._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].owner).toBe(testUser._id);
  });

  test("GET post by ID", async (): Promise<void> => {
    const response = await request(app).get(`/posts/${postId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(postId);
  });

  test("Create second Post", async (): Promise<void> => {
    const response = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${testUser.token}`)
      .send({
        title: "Test Post 2",
        content: "Test Content 2",
        owner: testUser._id,
      });

    expect(response.statusCode).toBe(201);
  });

  test("GET all posts (should have 2)", async (): Promise<void> => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Delete Post", async (): Promise<void> => {
    const response = await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", `Bearer ${testUser.token}`);

    expect(response.statusCode).toBe(200);

    const check = await request(app).get(`/posts/${postId}`);
    expect(check.statusCode).toBe(404);
  });

  test("Fail to create post without required fields", async (): Promise<void> => {
    const response = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${testUser.token}`)
      .send({
        content: "Missing title and owner",
      });

    expect(response.statusCode).toBe(400);
  });

  test("Create post with image and like data", async (): Promise<void> => {
    const response = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${testUser.token}`)
      .send({
        title: "Post with image and likes",
        content: "Some content here",
        owner: testUser._id,
        image: "https://example.com/image.png",
        likesCount: 1,
        likedBy: [testUser._id],
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.image).toBe("https://example.com/image.png");
    expect(response.body.likesCount).toBe(1);
    expect(response.body.likedBy).toContain(testUser._id);
  });

  test("Check post defaults when fields are missing", async (): Promise<void> => {
    const response = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${testUser.token}`)
      .send({
        title: "Post with defaults",
        content: "Only basic data",
        owner: testUser._id,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.image).toBe("");
    expect(response.body.likesCount).toBe(0);
    expect(response.body.likedBy).toEqual([]);
  });
});
