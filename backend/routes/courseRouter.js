const express = require("express");
const router = express.Router();

const getCourseVerificationController = require("../controllers/course/getCourseVerificationController");
const getACourseVerificationController = require("../controllers/course/getACourseVerificationController");
const addCourse = require("../controllers/course/addCourse");
const getCourseController = require("../controllers/course/getCourseController");
const courseVoteController = require("../controllers/course/courseVoteController");

router.route("/course").post(addCourse);

router.route("/course/department/:departmentID").get(getCourseController);

router
  .route("/courseverify/:departmentID")
  .get(getCourseVerificationController);

router
  .route("/courseverify/:departmentID/:courseCode")
  .get(getACourseVerificationController);

router.route("/coursevote/:courseID").post(courseVoteController);

module.exports = router;
