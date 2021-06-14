const dbPool = require("../../dbPool");
const {
  createErrorObject,
  createSuccessObjectWithData,
  validateInitials,
  validateNumber,
} = require("../../utils");

module.exports = function (req, res, next) {
  let facultyInitials = validateInitials(req.params.facultyInitials);
  let departmentID = validateNumber(req.params.departmentID);
  if (facultyInitials.error || departmentID.error) {
    return res.json(createErrorObject("Invalid Initials"));
  }
  dbPool.getConnection(function (err, connection) {
    if (err) {
      next(err);
      return;
    }

    let sql =
      "SELECT BIN_TO_UUID(fuid) as fuid, facultyName, facultyInitials, teaching, grading, friendliness, voteCount, duplicateCount from faculty where departmentID = ? and facultyInitials = ?";
    connection.query(
      sql,
      [departmentID.value, facultyInitials.value],
      (error, results) => {
        if (error) {
          console.log(error);
          res.json(createErrorObject("Error while querying"));
        } else {
          res.json(createSuccessObjectWithData(results));
        }
        connection.release();
      }
    );
  });
};
