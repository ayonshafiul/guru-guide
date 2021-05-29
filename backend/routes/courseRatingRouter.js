const express = require("express");
const router = express.Router();
const addCourseRate = require("../controllers/courserating/addCourseRate");
const getACourseRate = require("../controllers/courserating/getACourseRate");

router.route("/courserate/:courseID").post(addCourseRate);
router.route("/courserating/:courseID").get(getACourseRate);

module.exports = router;
