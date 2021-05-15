const express = require("express");
const router = express.Router();

const getARatingController = require("../controllers/rating/getARatingController");
const rateController = require("../controllers/rating/rateController");

router.route("/facultyrate/:facultyID").post(rateController);
router.route("/userrating/:facultyID/:courseID").get(getARatingController);

module.exports = router;
