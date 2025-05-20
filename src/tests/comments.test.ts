import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/comment_model";
import postModel from "../models/posts_model";
import userModel, { IUser } from "../models/users_model";
import { Express } from "express";
import testComments from "./test_comments.json";

let app: Express;
let token: string;
let userId: string;
let postId: string;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await commentsModel.deleteMany();
  await postModel.deleteMany();
  await userModel.deleteMany();

  const testUser = { email: "test@user.com", password: "testpassword", username: "testuser" };


  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  token = res.body.accessToken;
  userId = res.body._id;

 
  const postRes = await request(app)
    .post("/posts")
    .set("Authorization", `JWT ${token}`)
    .send({
      title: "Post for comments",
      content: "Post content",
      owner: userId,
    });

  postId = postRes.body._id;


  testComments[0].owner = userId;
  testComments[0].postId = postId;
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

let commentId = "";

describe("Comments Tests", () => {
  test("Comments test get all", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Comment", async () => {
    const response = await request(app)
      .post("/comments")
      .set("Authorization", `JWT ${token}`)
      .send(testComments[0]);

    expect(response.statusCode).toBe(201);
    expect(response.body.comment).toBe(testComments[0].comment);
    expect(response.body.postId).toBe(testComments[0].postId);
    expect(response.body.owner).toBe(testComments[0].owner);
    commentId = response.body._id;
  });

  test("Test get comment by owner", async () => {
    const response = await request(app).get("/comments?owner=" + testComments[0].owner);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].comment).toBe(testComments[0].comment);
    expect(response.body[0].postId).toBe(testComments[0].postId);
    expect(response.body[0].owner).toBe(testComments[0].owner);
  });

  test("Comments get post by id", async () => {
    const response = await request(app).get("/comments/" + commentId);
    expect(response.statusCode).toBe(200);
    expect(response.body.comment).toBe(testComments[0].comment);
    expect(response.body.postId).toBe(testComments[0].postId);
    expect(response.body.owner).toBe(testComments[0].owner);
  });

  test("Delete comment", async () => {
    const response = await request(app)
      .delete("/comments/" + commentId)
      .set("Authorization", `JWT ${token}`);
  
    expect(response.statusCode).toBe(200);
  
    const confirm = await request(app).get("/comments/" + commentId);
    expect(confirm.statusCode).toBe(404);
  });
  
});
