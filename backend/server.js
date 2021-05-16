const express = require("express");
const dotenv = require("dotenv").config();
const db = require("./db.js");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const authRouter = require("./routes/authRouter");
const facultyRouter = require("./routes/facultyRouter");
const courseRouter = require("./routes/courseRouter");
const commentRouter = require("./routes/commentRouter");
const ratingRouter = require("./routes/ratingRouter");

const authMiddleware = require("./middlewares/authentication");
const facultyVerify = require("./facultyVerify");
const courseVerify = require("./courseVerify");

const server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.json());
server.use(cookieParser());

server.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:3000",
      "http://guruguide.rocks",
    ],
    credentials: true,
  })
);

db.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Mysql connected...");
  }
});

server.use("/api", authRouter);
server.use("/api", authMiddleware, facultyRouter);
server.use("/api", authMiddleware, courseRouter);
server.use("/api", authMiddleware, commentRouter);
server.use("/api", authMiddleware, ratingRouter);

server.get("/forceupdate", (req, res) => {
  facultyVerify();
  courseVerify();
  res.json(createSuccessObject("Updated!"));
});

server.listen(process.env.PORT, function () {
  console.log(`Server is running on ${process.env.PORT}`);
});
