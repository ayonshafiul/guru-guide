const dbPool = require("../../dbPool");
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
    "SELECT commentText from comment where facultyID = ? and courseID = ?  and studentID = ?";

  dbPool.query(
    sql,
    [facultyID.value, courseID.value, studentID],
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
