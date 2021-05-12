const db = require("../../db");
const {
  createErrorObject,
  createSuccessObjectWithData,
  validateAlphaNumeric,
  validateNumber,
} = require("../../utils");
module.exports = function (req, res) {
  let departmentID = validateNumber(req.params.departmentID);
  let courseCode = validateAlphaNumeric(req.params.courseCode);

  if (departmentID.error || courseCode.error) {
    return res.json(createErrorObject("Invalid departmentID or courseCode"));
  }

  let sql =
    "SELECT courseTitle, courseCode, departmentID, upVoteSum, downVoteSum from courseverify where courseCode = ? and departmentID = ?";
  db.query(sql, [courseCode.value, departmentID.value], (error, results) => {
    if (error) {
      console.log(error);
      return res.json(createErrorObject("Error while querying"));
    } else {
      return res.json(createSuccessObjectWithData(results));
    }
  });
};
