const express = require("express");
const addCourseRate = require("../controllers/courserating/addCourseRate");
const router = express.Router();

router.route("/courserate/:courseID").post(addCourseRate);
// router.route("/userrating/:courseID/:courseID").get(getARatingController);
router.route("/courserating/:courseID").get(getRatingForACourse);

module.exports = router;
