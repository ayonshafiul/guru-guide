const dbPool = require("../../dbPool");
const redisClient = require("../../redisClient");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.CLIENT_ID;
const {
  createErrorObject,
  createSuccessObject,
  validatesub,
  validateComment,
} = require("../../utils");

module.exports = function (req, res, next) {
  const token = req.headers.auth;
  const client = new OAuth2Client(CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    let payload = null;
    let sub = null;
    try {
      payload = ticket.getPayload();
      if (payload.hd != "g.bracu.ac.bd") {
        return res.json(createErrorObject("notbracu"));
      }
      sub = payload.sub;
    } catch (err) {
      if (err) {
        return res.json(createErrorObject("Uh oh! Something bad happened!"));
      }
    }
    let finalSub = sub + process.env.SALT;
    var shasum = crypto.createHash("sha1");
    shasum.update(finalSub);
    let hash = shasum.digest("hex");

    dbPool.getConnection(function (err, connection) {
      if (err) {
        next(err);
        return;
      }
      let sql = "SELECT studentID from student where hash = ?";
      connection.query(sql, hash, (error, results) => {
        if (error) {
          connection.release();
          res.json(createErrorObject("Error while querying for student!"));
        } else {
          if (results.length == 0) {
            sql = "Insert into student set ?";
            let studentObject = {
              departmentID: 8,
              hash: hash,
            };
            connection.query(sql, studentObject, (error, results) => {
              if (error) {
                res.json(
                  createErrorObject("Error while creating a new student!")
                );
              } else {
                signInUser(results.insertId);
              }
              connection.release();
            });
          } else {
            signInUser(results[0].studentID);
            connection.release();
          }
        }
      });
    });
  }

  verify().then(function () {});

  function signInUser(studentID) {
    const token = jwt.sign({ studentID }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign(
      { studentID },
      process.env.REFRESH_JWT_SECRET,
      {
        expiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
      }
    );
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() +
          parseInt(process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,
    });
    res.cookie("rjwt", refreshToken, {
      expires: new Date(
        Date.now() +
          parseInt(process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,
    });
    redisClient.setex(
      "s" + studentID,
      86400 * 30,
      refreshToken,
      function (err, reply) {}
    );
    res.status(200).json(createSuccessObject("loginsuccessfull"));
  }
};
