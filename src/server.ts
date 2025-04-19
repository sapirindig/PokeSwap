import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
import bodyParser from 'body-parser';
import postRoutes from "./routes/posts_routes";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_CONNECTION as string)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use('/posts', postRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!@@@@@@@@@');
});

export default app;
