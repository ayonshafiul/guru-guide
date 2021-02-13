const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

router.use(cookieParser());
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const googleLoginController = require("../controllers/googleLoginController");

router.route("/register").post(registerController);

router.route("/login").post(loginController);

router.route("/googlelogin").get(googleLoginController);
module.exports = router;
