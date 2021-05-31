const express = require("express");
const addQuery = require("../controllers/query/addQuery");
const getQuery = require("../controllers/query/getQuery");
const getUserQuery = require("../controllers/query/getUserQuery");
const router = express.Router();

router.route("/query").post(addQuery).get(getQuery);
router.route("/userquery").get(getUserQuery);

module.exports = router;
