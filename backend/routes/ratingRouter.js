const express = require("express");
const router = express.Router();

const getARatingController = require("../controllers/rating/getARatingController");
const getRatingForACourse = require("../controllers/rating/getRatingForACourse");
const rateController = require("../controllers/rating/rateController");

router.route("/facultyrate/:facultyID").post(rateController);
router.route("/userrating/:facultyID/:courseID").get(getARatingController);
router.route("/facultyrating/:facultyID/:courseID").get(getRatingForACourse);

module.exports = router;
