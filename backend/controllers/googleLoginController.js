const db = require("../db");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.CLIENT_ID;
const { createErrorObject, createSuccessObject } = require("../utils");

module.exports = function login(req, res) {
  const token = req.headers.auth;
  const client = new OAuth2Client(CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // Chance of error! Fix in future
    let sql = "SELECT email,studentID from student where email = ?";
    db.query(sql, payload.email, (error, results) => {
      if (error) {
        console.log(error);
        return res.json(createErrorObject("Error while querying for student!"));
      } else {
        if (results.length == 0) {
          sql = "Insert into student set ?";
          let studentObject = {
            name: payload.name,
            departmentID: 8,
            email: payload.email,
          };
          db.query(sql, studentObject, (error, results) => {
            if (error) {
              console.log(error);
              return res.json(
                createErrorObject("Error while creating a new student!")
              );
            } else {
              console.log("created new student!");
              signInUser(results.insertId);
            }
          });
        } else {
          signInUser(results[0].studentID);
        }
      }
    });
  }

  verify().then(function () {
    console.log("Verified!");
  });

  function signInUser(studentID) {
    const token = jwt.sign({ studentID }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    console.log("The token is" + token);
    res.cookie("jwt", token, 
      {
        expires: new Date(Date.now() + (Number(process.env.JWT_COOKIE_EXPIRES) * 86400)), 
        httpOnly: true
      }
    );
    res.status(200).json({ message: "user logged in", token: token });
  }
};
