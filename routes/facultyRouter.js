const express = require("express");
const router = express.Router();

const addFaculty = require("../controllers/addFaculty");
const addDepartment = require("../controllers/addDepartment");
const getFaculty = require("../controllers/getFacultyController");


router.route("/faculty")
    .post(addFaculty)
    .get(getFaculty);

router.route("/department")
    .post(addDepartment);    
module.exports = router;