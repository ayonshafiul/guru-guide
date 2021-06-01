const express = require("express");
const addReply = require("../controllers/reply/addReply");
const getReply = require("../controllers/reply/getReply");
const replyVote = require("../controllers/reply/replyVote");
const router = express.Router();

router.route("/reply/:queryID").post(addReply).get(getReply);
router.route("/replyvote/:replyID").post(replyVote);

module.exports = router;
