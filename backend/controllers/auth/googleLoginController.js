const dbPool = require("../../dbPool");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.CLIENT_ID;
const { createErrorObject, createSuccessObject } = require("../../utils");

module.exports = function (req, res, next) {
  const token = req.headers.auth;
  const client = new OAuth2Client(CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // Chance of error! Fix in future

    let sql = "SELECT email,studentID from student where email = ?";
    dbPool.getConnection(function (err, connection) {
      if (err) {
        next(err);
        return;
      }
      connection.query(sql, payload.email, (error, results) => {
        if (error) {
          console.log(error);
          connection.release();
          res.json(createErrorObject("Error while querying for student!"));
        } else {
          if (results.length == 0) {
            sql = "Insert into student set ?";
            let studentObject = {
              name: payload.name,
              departmentID: 8,
              email: payload.email,
            };
            connection.query(sql, studentObject, (error, results) => {
              if (error) {
                console.log(error);
                res.json(
                  createErrorObject("Error while creating a new student!")
                );
              } else {
                signInUser(results.insertId);
              }
              connection.release();
            });
          } else {
            connection.release();
            signInUser(results[0].studentID);
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
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() +
          Number(process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,
    });
    res.status(200).json(createSuccessObject("loginsuccessfull"));
  }
};
