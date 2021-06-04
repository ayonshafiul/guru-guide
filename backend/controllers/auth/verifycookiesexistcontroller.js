const jwt = require("jsonwebtoken");
const { createErrorObject, createSuccessObject } = require("../../utils");
const redisClient = require("../../redisClient");

module.exports = (req, res, next) => {
  const token = req.cookies["jwt"];
  const refreshToken = req.cookies["rjwt"];

  if (!token || !refreshToken) {
    res.clearCookie("jwt");
    res.clearCookie("rjwt");
    return res.json(createErrorObject("NO_AUTH"));
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decode.studentID != "undefined") {
      res.json(createSuccessObject("Authenticated!"));
    } else {
      res.clearCookie("jwt");
      res.clearCookie("rjwt");
      res.json(createErrorObject("Invalid authentication!"));
    }
  } catch (error) {
    if (error.message == "jwt expired") {
      //check if the cookie is in redis
      const decode = jwt.verify(token, process.env.JWT_SECRET, {
        ignoreExpiration: true,
      });
      let studentID = decode.studentID;
      redisClient.get("s" + studentID, function (err, reply) {
        if (reply) { // token exists in redis
          if (refreshToken == reply) { // token matches
            const token = jwt.sign({ studentID }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN,
            });

            res.cookie("jwt", token, {
              expires: new Date(
                Date.now() +
                  parseInt(process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000
              ),
              httpOnly: true,
              secure: true,
            });
            res.json(createSuccessObject("Authenticated!"));
          } else { // token does not match
            res.clearCookie("jwt");
            res.clearCookie("rjwt");
            res.json(createErrorObject("Invalid authentication!"));
          }
        } else { // token does not exist
          res.clearCookie("jwt");
          res.clearCookie("rjwt");
          res.json(createErrorObject("Invalid authentication!"));
        }
      });
    } else { // other error
      res.clearCookie("jwt");
      res.clearCookie("rjwt");
      res.json(createErrorObject("Error in the token"));
    }
  }
};
