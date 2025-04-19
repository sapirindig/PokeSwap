const mongoose = require("mongoose");
const app = require("../server");
require("dotenv").config();

const testUser = {
  _id: "68036b6fa24839a1612b3ed8",
  token: "fake-test-token",
};

beforeAll(async () => {
  console.log("Connecting to test DB...");
  await mongoose.connect(process.env.DB_CONNECTION);
});

afterAll(async () => {
  console.log("Closing DB connection...");
  await mongoose.connection.close();
});

module.exports = { app, testUser };
