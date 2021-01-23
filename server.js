const express = require("express");
const dotenv = require("dotenv").config();
const db = require("./db.js");
const mysql = require("mysql");


const authRouter = require("./routes/authRouter");
const facultyRouter = require("./routes/facultyRouter");
const actionRouter = require("./routes/actionRouter");
const deleteFacultyController = require("./controllers/deleteFacultyController");
const e = require("express");


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



let lateInterval = 24*60*60*1000;
setInterval(deleteFacultyController.approve,lateInterval);
setInterval(deleteFacultyController.removeUnapproved,lateInterval+5000);
setInterval(deleteFacultyController.removeDuplicate,lateInterval+10000);



server.listen(process.env.PORT || 8090, function() {
    console.log("server is running");
});
