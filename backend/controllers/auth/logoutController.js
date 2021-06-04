const jwt = require("jsonwebtoken");
const { createSuccessObject } = require("../../utils");
const redisClient = require("../../redisClient");

module.exports = (req, res, next) => {
  let studentID = req.user.studentID;
  redisClient.setex("s" + studentID, 1, "loggedout", function (err, reply) {});
  res.clearCookie("jwt");
  res.clearCookie("rjwt");
  res.json(createSuccessObject("loggedout"));
};
