const dbPool = require("../../dbPool");
const {
  createErrorObject,
  createSuccessObjectWithData,
  validateNumber,
} = require("../../utils");

module.exports = function (req, res, next) {
  let departmentID = validateNumber(req.params.departmentID);

  if (departmentID.error) {
    return res.json(createErrorObject("Invalid departmentID"));
  }

  let sql =
    "SELECT facultyName, facultyInitials, departmentID, BIN_TO_UUID(fuid) as fuid, teaching, grading, friendliness, voteCount from faculty where departmentID = ? and approved = 1";

  dbPool.query(sql, departmentID.value, (error, results) => {
    if (error) {
      console.log(error);
      res.json(createErrorObject("Error while querying"));
    } else {
      res.json(createSuccessObjectWithData(results));
    }
  });
};
