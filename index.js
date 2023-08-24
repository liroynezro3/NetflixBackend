//הגדרנו משתנה שיש לו יכולות מיוחדות של האקספרס
const express = require("express");
//יצרנו משתנה שיש לו את היכולת של אקספרסס כולל האזנה לראוט
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv"); //עשיתי שימוש ב ENV
const router = require("express").Router();
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users"); 
const movieRoute = require("./routes/movies"); 
const listRoute = require("./routes/lists"); 
const cors = require('cors')
dotenv.config();
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("Couldn't connect to MongoDB");
  });
  
app.use(cors());
app.use(express.json())
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);
app.use("/api", router.get("/", async (req, res) => {
  res.status(200).json("Api work")
}
 ));

 
let port = process.env.PORT || "8800";

app.listen(port, () => {
  console.log("Backend server is running!");
});
