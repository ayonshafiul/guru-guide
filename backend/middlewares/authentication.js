const jwt = require("jsonwebtoken");
const redisClient = require("../redisClient");
const { createSuccessObjectWithData, createErrorObject } = require("../utils");

let counter = 0;

module.exports = function (req, res, next) {
  if (typeof req.cookies == "undefined") {
    return res.json(createErrorObject("invalid credentials"));
  }
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
      req.user = { studentID: decode.studentID };
      next();
    } else {
      res.clearCookie("jwt");
      res.clearCookie("rjwt");
      return res.json(createErrorObject("token invalid"));
    }
  } catch (error) {
    if (error.message == "jwt expired") {
      //check if the cookie is in redis
      const decode = jwt.verify(token, process.env.JWT_SECRET, {
        ignoreExpiration: true,
      });
      let studentID = decode.studentID;
      redisClient.get("s" + studentID, function (err, reply) {
        if (reply) {
          if (refreshToken == reply) {
            console.log("match");
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
              sameSite: "none",
            });
            console.log(counter++);
            req.user = { studentID };
            next();
          } else {
            res.clearCookie("jwt");
            res.clearCookie("rjwt");
            res.json(createErrorObject("log out"));
          }
        } else {
          res.clearCookie("jwt");
          res.clearCookie("rjwt");
          res.json(createErrorObject("logged out"));
        }
      });
    } else {
      res.clearCookie("jwt");
      res.clearCookie("rjwt");
      res.json(createErrorObject("Error in the token"));
    }
  }
};
