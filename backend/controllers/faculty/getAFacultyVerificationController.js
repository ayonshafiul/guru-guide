const dbPool = require("../../dbPool");
const {
  createErrorObject,
  createSuccessObjectWithData,
  validateNumber,
  validateCharactersOnly,
} = require("../../utils");

module.exports = function (req, res, next) {
  let departmentID = validateNumber(req.params.departmentID);
  let facultyInitials = validateCharactersOnly(req.params.facultyInitials);

  if (departmentID.error || facultyInitials.error) {
    return res.json(
      createErrorObject("Invalid departmentID or facultyInitials")
    );
  }

  let sql =
    "SELECT facultyID, facultyName, facultyInitials, departmentID, upVoteSum, downVoteSum from facultyverify where facultyInitials = ? and departmentID = ?";
  dbPool.query(
    sql,
    [facultyInitials.value, departmentID.value],
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
