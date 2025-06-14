
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import express, { Express } from "express";
import postsRoute from "./routes/posts_routes";
import commentsRoute from "./routes/comments_routes";
import authRoutes from "./routes/auth_routes";
import mongoose from "mongoose";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import cors from "cors";
import path from "path";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/posts", postsRoute);
app.use("/comments", commentsRoute);
app.use("/auth", authRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/postImages', express.static(path.join(__dirname, '..', 'postImages')));


const options = {
  definition: {
  openapi: "3.0.0",
  info: {
  title: "Web Dev 2022 REST API",
  version: "1.0.0",
  description: "REST server including authentication using JWT",
  },
  servers: [{url: "http://localhost:" + process.env.PORT,},],
  },
  apis: ["./src/routes/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
 

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    if (!process.env.DB_CONNECT) {
      reject("DB_CONNECT is not defined in .env file");
    } else {
      mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => {
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export default initApp;