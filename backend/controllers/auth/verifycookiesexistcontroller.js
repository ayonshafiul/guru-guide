const db = require("../../db");
const jwt = require("jsonwebtoken");
const { createErrorObject, createSuccessObject } = require("../../utils");

module.exports = (req, res, next) => {
  if (typeof req.cookies["jwt"] != "undefined") {
    const token = req.cookies["jwt"];
    try {
      const decodedtoken = jwt.verify(token, process.env.JWT_SECRET);
      if (typeof decodedtoken.studentID != "undefined") {
        return res.json(createSuccessObject("Authenticated!"));
      } else {
        return res.json(createErrorObject("Invalid authentication!"));
      }
    } catch (err) {}
  } else {
    return res.json(createErrorObject("Not authenticated!"));
  }
};
