const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

const googleLoginController = require("../controllers/googleLoginController");
const verifycookiesexistcontroller= require("../controllers/verifycookiesexistcontroller");


router.route("/googlelogin").get(googleLoginController);
router.route("/isauth").get(verifycookiesexistcontroller);


module.exports = router;
