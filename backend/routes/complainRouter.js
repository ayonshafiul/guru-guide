const express = require("express");
const router = express.Router();

const addComplain = require("../controllers/complain/addComplain");
const complainVote = require("../controllers/complain/complainVote");
const getAComplain = require("../controllers/complain/getAComplain");
const getComplain = require("../controllers/complain/getComplain");

router.route("/complain/").post(addComplain).get(getComplain);
router.route("/complain/single").get(getAComplain);
router.route("/complainvote/:complainID").post(complainVote);

module.exports = router;
