const db = require("../db.js");
const { createErrorObject, createSuccessObjectWithData } = require("../utils");

module.exports = function abc(req, res) {
  let { departmentID, facultyName, facultyInitials } = req.body;
  departmentID = parseInt(departmentID);
  facultyName = String(facultyName);
  facultyInitials = String(facultyInitials).substring(0, 3);

  if (
    typeof departmentID !== "number" ||
    typeof facultyInitials !== "string" ||
    typeof facultyName !== "string"
  ) {
    return res.json(createErrorObject("Invalid parameters"));
  }

  var sql = "INSERT INTO facultyverify SET ?";
  var value = {
    departmentID,
    facultyName,
    facultyInitials,
  };
  db.query(sql, value, function (error, results) {
    if (error) {
      console.log(error);
    } else {
      res.json(createSuccessObjectWithData("Faculty added!"));
    }
  });
};
