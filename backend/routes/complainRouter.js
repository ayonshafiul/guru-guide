const express = require("express");
const router = express.Router();

const addComplain = require("../controllers/complain/addComplain");
const getComplain = require("../controllers/complain/getComplain");

router.route("/complain/").post(addComplain).get(getComplain);
router.route("/complain/another").get(addComplain);

module.exports = router;
