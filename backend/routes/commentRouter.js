const express = require("express");
const router = express.Router();

const addComment = require("../controllers/comment/addComment");
const commentVoteController = require("../controllers/comment/commentVoteController");
const getCommentController = require("../controllers/comment/getCommentController");

router
  .route("/comment/:facultyID/:courseID")
  .post(addComment)
  .get(getCommentController);

router.route("/commentvote/:commentID").post(commentVoteController);

module.exports = router;