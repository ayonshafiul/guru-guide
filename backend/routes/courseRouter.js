const express = require("express");
const router = express.Router();

const getCourseVerificationController = require("../controllers/course/getCourseVerificationController");
const getACourseVerificationController = require("../controllers/course/getACourseVerificationController");
const addCourse = require("../controllers/course/addCourse");
const getCourseController = require("../controllers/course/getCourseController");

router.route("/course").post(addCourse);

router.route("/course/:departmentID").get(getCourseController);

router
  .route("/courseverify/:departmentID")
  .get(getCourseVerificationController);

router
  .route("/courseverify/:departmentID/:courseCode")
  .get(getACourseVerificationController);

module.exports = router;
