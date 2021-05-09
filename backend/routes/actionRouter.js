const express = require("express");
const router = express.Router();

const voteController = require("../controllers/voteController");
const rateController = require("../controllers/rateController");
const commentController = require("../controllers/commentController");
const commentRatingController = require("../controllers/commentRatingController");
const getCommentController = require("../controllers/getCommentController");
const getFacultyVerificationController = require("../controllers/getFacultyVerificationController");
const getAFacultyVerificationController = require("../controllers/getAFacultyVerificationController");
const getCourseVerificationController = require("../controllers/getCourseVerificationController");
const getACourseVerificationController = require("../controllers/getACourseVerificationController");

router.route("/facultyvote/:facultyID/:voteType").post(voteController);

router
  .route("/facultyverify/:departmentID")
  .get(getFacultyVerificationController);

router
  .route("/facultyverify/:departmentID/:facultyInitials")
  .get(getAFacultyVerificationController);

router.route("/courseverify/:departmentID").get(getCourseVerificationController);

router.route("/courseverify/:departmentID/:courseCode").get(getACourseVerificationController);


router.route("/rate/:facultyID").post(rateController);

router
  .route("/comment/:facultyID")
  .post(commentController)
  .get(getCommentController);

router
  .route("/comment/rate/:commentID/:voteType")
  .post(commentRatingController);

module.exports = router;
