const express = require("express");
const router = express.Router();

const voteController = require("../controllers/voteController");
router.route("/vote/:facultyID/:voteType")
    .post(voteController);
   
module.exports = router;