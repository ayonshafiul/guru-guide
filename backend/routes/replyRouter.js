const express = require("express");
const addReply = require("../controllers/reply/addReply");
const getReply = require("../controllers/reply/getReply");
const router = express.Router();

router.route("/reply/:queryID").post(addReply).get(getReply);

module.exports = router;
