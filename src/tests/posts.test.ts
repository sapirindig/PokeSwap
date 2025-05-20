import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";
import userModel, { IUser } from "../models/users_model";

var app: Express;

type User = IUser & { token?: string };
const testUser: User = {
  email: "test@example.com",
  password: "123456",
  username: "tester"
};

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await postModel.deleteMany();
  await userModel.deleteMany();

  await request(app).post("/auth/register").send(testUser);

  const res = await request(app).post("/auth/login").send(testUser);
  console.log("LOGIN RESPONSE:", res.body);
  testUser.token = res.body.accessToken;
  testUser._id = res.body._id;
  expect(testUser.token).toBeDefined();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

let postId = "";

describe("Posts Tests", () => {
  test("Posts test get all", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Post", async () => {
    const response = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Test Post",
        content: "Test Content",
        owner: testUser._id
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
    postId = response.body._id;
  });

  test("Test Create Post 2", async () => {
    const response = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Test Post 2",
        content: "Test Content 2",
        owner: testUser._id
      });
    expect(response.statusCode).toBe(201);
  });

  test("Test Create Post fail", async () => {
    const response = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        content: "Test Content 2",
      });
    expect(response.statusCode).toBe(400);
  });
  
  test("Test get post by id", async () => {
    const response = await request(app)
      .get("/posts/" + postId)
      .set("Authorization", "JWT " + testUser.token);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
  });

  test("Test get post by owner", async () => {
    const response = await request(app).get("/posts?owner=" + testUser._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Posts test get all 2", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Get my posts", async () => {
    const response = await request(app)
      .get("/posts/user/me")
      .set("Authorization", "JWT " + testUser.token);
  
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].owner).toBe(testUser._id);
  });
  
  test("Update a post", async () => {
    const updateRes = await request(app)
      .put(`/posts/${postId}`)
      .set("Authorization", "JWT " + testUser.token)
      .send({
        title: "Updated Title",
        content: "Updated Content",
      });
  
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.title).toBe("Updated Title");
    expect(updateRes.body.content).toBe("Updated Content");
  });
  
  test("Like a post", async () => {
    const likeRes = await request(app)
      .post(`/posts/${postId}/like`)
      .set("Authorization", "JWT " + testUser.token);
  
    expect(likeRes.statusCode).toBe(200);
    expect(likeRes.body.likesCount).toBeDefined();
    expect(likeRes.body.likedBy).toContain(testUser._id);
  });
  
  test("Unlike a post", async () => {
    const unlikeRes = await request(app)
      .delete(`/posts/${postId}/unlike`)
      .set("Authorization", "JWT " + testUser.token);
  
    expect(unlikeRes.statusCode).toBe(200);
    expect(unlikeRes.body.likesCount).toBeDefined();
    expect(unlikeRes.body.likedBy).not.toContain(testUser._id);
  });
  

  test("Test Delete Post", async () => {
    const response = await request(app).delete("/posts/" + postId)
      .set({ authorization: "JWT " + testUser.token });
    expect(response.statusCode).toBe(200);

    const response2 = await request(app)
      .get("/posts/" + postId)
      .set("Authorization", "JWT " + testUser.token);

    expect(response2.statusCode).toBe(404);
  });

});
