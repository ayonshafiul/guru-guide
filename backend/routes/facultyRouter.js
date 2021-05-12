const express = require("express");
const router = express.Router();

const addFaculty = require("../controllers/faculty/addFaculty");
const getFaculty = require("../controllers/faculty/getFacultyController");
const getAFaculty = require("../controllers/faculty/getAFacultyController");
const facultyVoteController = require("../controllers/faculty/facultyVoteController");
const rateController = require("../controllers/faculty/rateController");
const getFacultyVerificationController = require("../controllers/faculty/getFacultyVerificationController");
const getAFacultyVerificationController = require("../controllers/faculty/getAFacultyVerificationController");

router.route("/faculty").post(addFaculty);

router.route("/faculty/:departmentID").get(getFaculty);

router.route("/faculty/:facultyID").get(getAFaculty);

router.route("/facultyvote/:facultyID/:voteType").get(facultyVoteController);

router
  .route("/facultyverify/:departmentID")
  .get(getFacultyVerificationController);

router
  .route("/facultyverify/:departmentID/:facultyInitials")
  .get(getAFacultyVerificationController);

router.route("/facultyrate/:facultyID").post(rateController);

module.exports = router;
