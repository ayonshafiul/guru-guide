const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql");

const jwt = require("jsonwebtoken");
const server = express();

dotenv.config( );
const db = require("./db.js");
const register = require("./student/register");

server.use(express.json());

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


server.post('/register', (req, res) => {});
    
        
    
    

server.listen(8090, function() {
    console.log("server is running");
})
