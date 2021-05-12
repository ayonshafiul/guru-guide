const express = require("express");
const router = express.Router();

const facultyVoteController = require("../controllers/facultyVoteController");
const rateController = require("../controllers/rateController");
const addComment = require("../controllers/addComment");
const commentVoteController = require("../controllers/commentVoteController");
const getCommentController = require("../controllers/getCommentController");
const getFacultyVerificationController = require("../controllers/getFacultyVerificationController");
const getAFacultyVerificationController = require("../controllers/getAFacultyVerificationController");
const getCourseVerificationController = require("../controllers/getCourseVerificationController");
const getACourseVerificationController = require("../controllers/getACourseVerificationController");
const addCourse = require("../controllers/addCourse");

router.route("/facultyvote/:facultyID/:voteType").get(facultyVoteController);

router
  .route("/facultyverify/:departmentID")
  .get(getFacultyVerificationController);

router
  .route("/facultyverify/:departmentID/:facultyInitials")
  .get(getAFacultyVerificationController);

router.route("/course").post(addCourse);

router
  .route("/courseverify/:departmentID")
  .get(getCourseVerificationController);

router
  .route("/courseverify/:departmentID/:courseCode")
  .get(getACourseVerificationController);

router.route("/facultyrate/:facultyID").post(rateController);

router
  .route("/comment/:facultyID/:courseID")
  .post(addComment)
  .get(getCommentController);

router.route("/commentvote/:commentID/:voteType").get(commentVoteController);

module.exports = router;
