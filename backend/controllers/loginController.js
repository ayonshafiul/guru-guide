const express = require("express");
const dotenv = require("dotenv").config();
const db = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password not provided" });
    }

    db.query(
      "SELECT * FROM student WHERE email = ?",
      [email],
      async (error, results) => {
        if (typeof results[0] == "undefined") {
          return res.status(400).json({ error: "wrong email" });
        } else {
          if (!(await bcrypt.compare(password, results[0].password))) {
            return res.status(400).render({ error: "password incorrect" });
          } else {
            const id = results[0].studentID;
            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN,
            });

            console.log("The token is" + token);

            cookieOptions = {
              expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
              ),
              httpOnly: true,
            };
            res.cookie("jwt", token, cookieOptions);
            res.status(200).json({ message: "user logged in", token: token });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
