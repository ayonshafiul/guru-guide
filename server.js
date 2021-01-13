const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql");
const server = express();


dotenv.config( {path:"./.env"});
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
});

db.connect((err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Mysql connected...");
    }
});


server.get("/", function(req, res) {
    res.json({hello: "string"});
})

server.listen(8090, function() {
    console.log("server is running");
})
