const dbPool = require("../../dbPool.js");
const {
  createErrorObject,
  createSuccessObjectWithData,
  createSuccessObject,
  validateAlphaNumeric,
  validateNumber,
  validateCharactersOnlyWithSpaces,
} = require("../../utils");

module.exports = function addCourse(req, res, next) {
  let { departmentID, courseTitle, courseCode } = req.body;
  departmentID = validateNumber(departmentID);
  courseTitle = validateCharactersOnlyWithSpaces(courseTitle);
  courseCode = validateAlphaNumeric(courseCode);

  if (departmentID.error || courseCode.error || courseTitle.error) {
    return res.json(
      createErrorObject("Invalid departmentID or courseCode or courseTitle")
    );
  }

  const sql = "INSERT INTO courseverify SET ?";
  const faculty = {
    departmentID: departmentID.value,
    courseTitle: courseTitle.value,
    courseCode: courseCode.value,
  };
  dbPool.query(sql, faculty, function (error, results) {
    if (error) {
      console.log(error);
    } else {
      res.json(createSuccessObject("Course added!"));
    }
  });
};
