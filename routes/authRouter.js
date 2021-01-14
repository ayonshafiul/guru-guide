const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");


router.route("/register")
    .post(registerController);



module.exports = router;