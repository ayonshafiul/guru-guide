const express = require("express");
const router = express.Router();

const addFaculty = require("../controllers/addFaculty");
const addDepartment = require("../controllers/addDepartment");
const getFaculty = require("../controllers/getFacultyController");
const getAFaculty = require("../controllers/getAFacultyController");

router.route("/faculty").post(addFaculty).get(getFaculty);

router.route("/faculty/:facultyID").get(getAFaculty);

module.exports = router;
