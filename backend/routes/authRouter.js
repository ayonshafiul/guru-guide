const express = require("express");
const router = express.Router();

const googleLoginController = require("../controllers/auth/googleLoginController");
const verifycookiesexistcontroller= require("../controllers/auth/verifycookiesexistcontroller");


router.route("/googlelogin").get(googleLoginController);
router.route("/isauth").get(verifycookiesexistcontroller);


module.exports = router;
