const db = require("../db.js");
const { createErrorObject, createSuccessObjectWithData, createSuccessObject } = require("../utils");
const {
  validateNumber,
  validateCharactersOnlyWithSpaces,
  validateCharactersOnly,
} = require("../utils");

module.exports = function addFaculty(req, res) {
  let { departmentID, facultyName, facultyInitials } = req.body;
  departmentID = validateNumber(departmentID);
  facultyName = validateCharactersOnlyWithSpaces(facultyName);
  facultyInitials = validateCharactersOnly(facultyInitials);

  if (departmentID.error || facultyInitials.error || facultyName.error) {
    return res.json(
      createErrorObject(
        "Invalid departmentID or facultyInitials or facultyName"
      )
    );
  }

  var sql = "INSERT INTO facultyverify SET ?";
  var faculty = {
    departmentID: departmentID.value,
    facultyName: facultyName.value,
    facultyInitials: facultyInitials.value,
  };
  db.query(sql, faculty, function (error, results) {
    if (error) {
      console.log(error);
    } else {
      res.json(createSuccessObject("Faculty added!"));
    }
  });
};
