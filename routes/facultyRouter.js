const express = require("express");
const router = express.Router();

const addFaculty = require("../controllers/addFaculty");
const addDepartment = require("../controllers/addDepartment");


router.route("/addFaculty")
    .post(addFaculty);

router.route("/addDepartment")
    .post(addDepartment);    
module.exports = router;