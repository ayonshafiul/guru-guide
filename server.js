const express = require("express");
const dotenv = require("dotenv").config();
const db = require("./db.js");
const mysql = require("mysql");
const bcrypt = require('bcrypt');
const authRouter = require("./routes/authRouter");

const jwt = require("jsonwebtoken");
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


server.listen(process.env.PORT || 8090, function() {
    console.log("server is running");
});
