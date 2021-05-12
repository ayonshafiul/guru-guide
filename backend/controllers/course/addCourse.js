const db = require("../../db.js");
const {
  createErrorObject,
  createSuccessObjectWithData,
  createSuccessObject,
  validateAlphaNumeric,
  validateNumber,
  validateCharactersOnlyWithSpaces
} = require("../../utils");


module.exports = function addCourse(req, res) {
  let { departmentID, courseTitle, courseCode } = req.body;
  departmentID = validateNumber(departmentID);
  courseTitle = validateCharactersOnlyWithSpaces(courseTitle);
  courseCode = validateAlphaNumeric(courseCode);

  if (departmentID.error || courseCode.error || courseTitle.error) {
    return res.json(
      createErrorObject("Invalid departmentID or courseCode or courseTitle")
    );
  }

  var sql = "INSERT INTO courseverify SET ?";
  var faculty = {
    departmentID: departmentID.value,
    courseTitle: courseTitle.value,
    courseCode: courseCode.value,
  };
  db.query(sql, faculty, function (error, results) {
    if (error) {
      console.log(error);
    } else {
      res.json(createSuccessObject("Course added!"));
    }
  });
};
