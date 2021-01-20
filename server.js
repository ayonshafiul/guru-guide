const express = require("express");
const dotenv = require("dotenv").config();
const db = require("./db.js");
const mysql = require("mysql");


const authRouter = require("./routes/authRouter");
const facultyRouter = require("./routes/facultyRouter");
const actionRouter = require("./routes/actionRouter");
const sumVoteController = require("./controllers/sumVoteController");


const server = express();


server.use(express.json());

db.connect((err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Mysql connected...");
    }
});
server.use("/", authRouter);
server.use("/", facultyRouter);
server.use("/", actionRouter);



server.listen(process.env.PORT || 8090, function() {
    console.log("server is running");
});
