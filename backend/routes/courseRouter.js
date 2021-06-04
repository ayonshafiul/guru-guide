const express = require("express");
const router = express.Router();

const getCourseVerificationController = require("../controllers/course/getCourseVerificationController");
const getACourseVerificationController = require("../controllers/course/getACourseVerificationController");
const addCourse = require("../controllers/course/addCourse");
const getCourseController = require("../controllers/course/getCourseController");
const courseVoteController = require("../controllers/course/courseVoteController");
const getACourse = require("../controllers/course/getACourse");
const getACourseByUID = require("../controllers/course/getACourseByUID");

router.route("/course").post(addCourse);

router.route("/course/department/:departmentID").get(getCourseController);

router.route("/course/:courseID").get(getACourse);
router.route("/course/uid/:courseID").get(getACourseByUID);
router
  .route("/courseverify/:departmentID")
  .get(getCourseVerificationController);

router
  .route("/courseverify/:departmentID/:courseCode")
  .get(getACourseVerificationController);

router.route("/coursevote/:courseID").post(courseVoteController);

module.exports = router;
