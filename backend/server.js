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

const server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.json());
server.use(cookieParser());

server.use(
  cors({
    origin: "http://localhost:1234",
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
server.use("/api", auth, facultyRouter);
server.use("/api", auth, actionRouter);

let lateInterval = 24 * 60 * 60 * 1000;
setInterval(deleteFacultyController.approve, lateInterval);
setInterval(deleteFacultyController.removeUnapproved, lateInterval + 5000);
setInterval(deleteFacultyController.removeDuplicate, lateInterval + 10000);

server.listen(process.env.PORT || 8090, function () {
  console.log("server is running");
});
