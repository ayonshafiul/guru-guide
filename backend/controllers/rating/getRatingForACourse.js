const db = require("../../db");
const {
  validateNumber,
  createErrorObject,
  createSuccessObjectWithData,
} = require("../../utils");

module.exports = function (req, res, next) {
  let facultyID = validateNumber(req.params.facultyID);
  let courseID = validateNumber(req.params.courseID);
  let studentID = req.user.studentID;

  if (facultyID.error || courseID.error) {
    return res.json(createErrorObject("Invalid facultyID or courseID"));
  }

  let sql =
    "SELECT count(*) as voteCount, sum(teaching) as teaching, sum(friendliness) as friendliness, sum(grading) as grading FROM rating WHERE facultyID = ? and courseID = ?";

  db.query(sql, [facultyID.value, courseID.value], (error, results) => {
    if (error) {
      console.log(error);
      return res.json(createErrorObject("Error while querying"));
    } else {
      if (results[0].voteCount == 0) {
        return res.json(createErrorObject("no data"));
      }
      return res.json(createSuccessObjectWithData(results[0]));
    }
  });
};
