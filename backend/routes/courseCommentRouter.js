const express = require("express");
const addCourseComment = require("../controllers/coursecomment/addCourseComment");
const courseCommentVote = require("../controllers/coursecomment/courseCommentVote");
const getCourseComment = require("../controllers/coursecomment/getCourseComment");
const router = express.Router();

router
  .route("/coursecomment/:courseID")
  .post(addCourseComment)
  .get(getCourseComment);

router.route("/coursecommentvote/:commentID").post(courseCommentVote);

module.exports = router;
