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
const actionRouter = require("./routes/actionRouter");
const deleteFacultyController = require("./controllers/deleteFacultyController");
const auth = require("./authentication");
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

server.use(express.static(path.join(__dirname, "public")));
server.set("view engine", "ejs");

db.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Mysql connected...");
  }
});
server.use("/api", authRouter);
server.use("/api", facultyRouter);
server.use("/api", actionRouter);

let interval = 3 * 60 * 60 * 1000;

setInterval(facultyVerify, interval);
setInterval(courseVerify, interval);

server.listen(process.env.PORT, function () {
  console.log(`Server is running on ${process.env.PORT}`);
});
