const express = require("express");
const router = express.Router();
const schedule = require("node-schedule");

const voteController = require("../controllers/voteController");
const rateController = require("../controllers/rateController");
const commentController = require("../controllers/commentController");
const commentRatingController = require("../controllers/commentRatingController");
const getCommentController = require("../controllers/getCommentController");

router.route("/vote/:facultyID/:voteType")
    .post(voteController);

router.route("/rate/:facultyID")
.post(rateController);    

router.route("/comment/:facultyID")
.post(commentController)
.get(getCommentController);

router.route("/comment/rate/:commentID/:voteType")
.post(commentRatingController);

   
module.exports = router;