const express = require("express");
const router = express.Router();

const addFaculty = require("../controllers/faculty/addFaculty");
const getFaculty = require("../controllers/faculty/getFacultyController");
const getAFaculty = require("../controllers/faculty/getAFacultyController");
const facultyVoteController = require("../controllers/faculty/facultyVoteController");
const getFacultyVerificationController = require("../controllers/faculty/getFacultyVerificationController");
const getAFacultyVerificationController = require("../controllers/faculty/getAFacultyVerificationController");
const getAFacultyByInitials = require("../controllers/faculty/getAFacultyByInitials");
const facultyVerifyVoteController = require("../controllers/faculty/facultyVerifyVoteController");

router.route("/faculty").post(addFaculty);

router.route("/faculty/department/:departmentID").get(getFaculty);

router.route("/faculty/:facultyID").get(getAFaculty);
router
  .route("/faculty/:departmentID/:facultyInitials")
  .get(getAFacultyByInitials);

router.route("/facultyvote/:fuid").post(facultyVoteController);
router.route("/facultyverifyvote/:facultyID").post(facultyVerifyVoteController);

router
  .route("/facultyverify/:departmentID")
  .get(getFacultyVerificationController);

router
  .route("/facultyverify/:departmentID/:facultyInitials")
  .get(getAFacultyVerificationController);

module.exports = router;
