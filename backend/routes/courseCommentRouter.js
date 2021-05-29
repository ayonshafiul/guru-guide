const express = require("express");
const addCourseComment = require("../controllers/coursecomment/addCourseComment");
const courseCommentVote = require("../controllers/coursecomment/courseCommentVote");
const getCourseComment = require("../controllers/coursecomment/getCourseComment");
const router = express.Router();

router.route("/comment/:courseID").post(addCourseComment).get(getCourseComment);

// router.route("/usercomment/:courseID").get();

router.route("/commentvote/:commentID").post(courseCommentVote);

module.exports = router;
