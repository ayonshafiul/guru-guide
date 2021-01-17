const express = require("express");
const router = express.Router();

const voteController = require("../controllers/voteController");
const rateController = require("../controllers/rateController");
const commentController = require("../controllers/commentController");
router.route("/vote/:facultyID/:voteType")
    .post(voteController);

router.route("/rate/:facultyID")
.post(rateController);    

router.route("/comment/:facultyID")
.post(commentController);
   
module.exports = router;