const dbPool = require("../../dbPool");
const {
  createErrorObject,
  createSuccessObjectWithData,
  validateAlphaNumeric,
  validateNumber,
  validateCourseCode
} = require("../../utils");
module.exports = function (req, res) {
  let departmentID = validateNumber(req.params.departmentID);
  let courseCode = validateCourseCode(req.params.courseCode);

  
  if (departmentID.error || courseCode.error) {
    return res.json(createErrorObject("Invalid departmentID or courseCode"));
  }

  let sql =
    "SELECT courseID, courseTitle, courseCode, departmentID, upVoteSum, downVoteSum from courseverify where courseCode = ? and departmentID = ?";
  dbPool.query(
    sql,
    [courseCode.value, departmentID.value],
    (error, results) => {
      if (error) {
        console.log(error);
        res.json(createErrorObject("Error while querying"));
      } else {
        res.json(createSuccessObjectWithData(results));
      }
    }
  );
};
