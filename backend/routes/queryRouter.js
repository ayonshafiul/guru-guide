const express = require("express");
const addQuery = require("../controllers/query/addQuery");
const getQuery = require("../controllers/query/getQuery");
const getUserQuery = require("../controllers/query/getUserQuery");
const queryVote = require("../controllers/query/queryVote");
const router = express.Router();

router.route("/query").post(addQuery).get(getQuery);
router.route("/userquery").get(getUserQuery);
router.route("/queryvote/:queryID").post(queryVote);

module.exports = router;
