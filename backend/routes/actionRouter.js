const express = require("express");
const router = express.Router();

const voteController = require("../controllers/voteController");
const rateController = require("../controllers/rateController");
const commentController = require("../controllers/commentController");
const commentVoteController = require("../controllers/commentVoteController");
const getCommentController = require("../controllers/getCommentController");
const getFacultyVerificationController = require("../controllers/getFacultyVerificationController");
const getAFacultyVerificationController = require("../controllers/getAFacultyVerificationController");
const getCourseVerificationController = require("../controllers/getCourseVerificationController");
const getACourseVerificationController = require("../controllers/getACourseVerificationController");

router.route("/facultyvote/:facultyID/:voteType").get(voteController);

router
  .route("/facultyverify/:departmentID")
  .get(getFacultyVerificationController);

router
  .route("/facultyverify/:departmentID/:facultyInitials")
  .get(getAFacultyVerificationController);

router
  .route("/courseverify/:departmentID")
  .get(getCourseVerificationController);

router
  .route("/courseverify/:departmentID/:courseCode")
  .get(getACourseVerificationController);

router.route("/facultyrate/:facultyID").post(rateController);

router
  .route("/comment/:facultyID")
  .post(commentController)
  .get(getCommentController);

router.route("/commentvote/:commentID/:voteType").get(commentVoteController);

module.exports = router;
