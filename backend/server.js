const express = require("express");
const dotenv = require("dotenv").config();
const dbPool = require("./dbPool");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const authRouter = require("./routes/authRouter");
const facultyRouter = require("./routes/facultyRouter");
const courseRouter = require("./routes/courseRouter");
const commentRouter = require("./routes/commentRouter");
const courseCommentRouter = require("./routes/courseCommentRouter");
const ratingRouter = require("./routes/ratingRouter");
const courseRatingRouter = require("./routes/courseRatingRouter");
const complainRouter = require("./routes/complainRouter");
const queryRouter = require("./routes/queryRouter");
const replyRouter = require("./routes/replyRouter");

const authMiddleware = require("./middlewares/authentication");

const { createSuccessObject, createErrorObject } = require("./utils.js");

const server = express();
server.use(helmet());
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

server.use("/api", authRouter);

server.get("/api/forceupdate/", (req, res) => {
  res.json(createSuccessObject("Updated!"));
});

server.get("/api/ping/", (req, res) => {
  const all = dbPool._allConnections.length;
  const free = dbPool._freeConnections.length;
  res.json(createSuccessObject(all + " " + free));
});

server.use("/api", authMiddleware, facultyRouter);
server.use("/api", authMiddleware, courseRouter);
server.use("/api", authMiddleware, commentRouter);
server.use("/api", authMiddleware, courseCommentRouter);
server.use("/api", authMiddleware, ratingRouter);
server.use("/api", authMiddleware, courseRatingRouter);
server.use("/api", authMiddleware, complainRouter);
server.use("/api", authMiddleware, queryRouter);
server.use("/api", authMiddleware, replyRouter);

server.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).json(createErrorObject("Something bad happened! :("));
});

server.listen(process.env.PORT, function () {
  console.log(`Server is running on ${process.env.PORT}`);
});
