import mongoose from "mongoose";
import app from "../server";
import dotenv from "dotenv";

dotenv.config();

interface TestUser {
  _id: string;
  token: string;
}

const testUser: TestUser = {
  _id: "68036b6fa24839a1612b3ed8",
  token: "fake-test-token",
};

beforeAll(async (): Promise<void> => {
  console.log("Connecting to test DB...");
  await mongoose.connect(process.env.DB_CONNECTION as string);
});

afterAll(async (): Promise<void> => {
  console.log("Closing DB connection...");
  await mongoose.connection.close();
});

export { app, testUser };
