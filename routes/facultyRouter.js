const express = require("express");
const router = express.Router();

const addFaculty = require("../controllers/addFaculty");
const addDepartment = require("../controllers/addDepartment");


router.route("/faculty")
    .post(addFaculty);

router.route("/department")
    .post(addDepartment);    
module.exports = router;