const express = require("express");
const router = express.Router();

const googleLoginController = require("../controllers/auth/googleLoginController");
const logoutController = require("../controllers/auth/logoutController");
const verifycookiesexistcontroller = require("../controllers/auth/verifycookiesexistcontroller");
const authentication = require("../middlewares/authentication");

router.route("/googlelogin").get(googleLoginController);
router.route("/isauth").get(verifycookiesexistcontroller);
router.route("/logout").get(authentication, logoutController);

module.exports = router;
