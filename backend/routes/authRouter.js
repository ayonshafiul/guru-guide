const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const googleLoginController = require("../controllers/googleLoginController");
const verifycookiesexistcontroller= require("../controllers/verifycookiesexistcontroller");

router.route("/register").post(registerController);

router.route("/login").post(loginController);

router.route("/googlelogin").get(googleLoginController);

router.route("/isauth").get(verifycookiesexistcontroller);
module.exports = router;
