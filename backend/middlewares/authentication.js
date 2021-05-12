const jwt = require("jsonwebtoken");

const { createSuccessObjectWithData, createErrorObject } = require("../utils");

module.exports = function (req, res, next) {
  if (typeof req.cookies == "undefined") {
    return res.json(createErrorObject("invalid credentials"));
  }
  const token = req.cookies["jwt"];
  if (!token) {
    return res.json(createErrorObject("No cookies!"));
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decode.studentID != "undefined") {
      req.user = { studentID: decode.studentID };
      next();
    } else {
      return res.json(createErrorObject("token invalid"));
    }
  } catch (error) {
    res.json(createErrorObject("Error in the token"));
  }
};
