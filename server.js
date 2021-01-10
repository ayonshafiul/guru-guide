const express = require("express");

const server = express();

server.get("/", function(req, res) {
    res.json({hello: "string"});
})

server.listen(8080, function() {
    console.log("server is running");
})
