const express = require("express");
const router = express.Router();

const addComment = require("../controllers/comment/addComment");
const commentVoteController = require("../controllers/comment/commentVoteController");
const getACommentController = require("../controllers/comment/getACommentController");
const getCommentController = require("../controllers/comment/getCommentController");

router
  .route("/comment/:facultyID/:courseID")
  .post(addComment)
  .get(getCommentController);

router.route("/usercomment/:facultyID/:courseID").get(getACommentController);

router.route("/commentvote/:commentID").post(commentVoteController);

module.exports = router;
