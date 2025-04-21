import initApp from "./server";
const port = process.env.PORT;
import dotenv from "dotenv";
dotenv.config();

console.log("1");
initApp().then((app) => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});