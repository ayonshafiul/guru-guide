const db = require("../db");
const { createErrorObject, createSuccessObjectWithData } = require("../utils");
const { validateNumber, validateCharactersOnly } = require("../utils");
module.exports = function (req, res) {
  let departmentID = validateNumber(req.params.departmentID);
  let facultyInitials = validateCharactersOnly(req.params.facultyInitials);

  if (departmentID.error || facultyInitials.error) {
    return res.json(
      createErrorObject("Invalid departmentID or facultyInitials")
    );
  }

  let sql =
    "SELECT facultyID, facultyName, facultyInitials, departmentID, upVoteSum, downVoteSum from facultyverify where facultyInitials = ? and departmentID = ?";
  db.query(
    sql,
    [facultyInitials.value, departmentID.value],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.json(createErrorObject("Error while querying"));
      } else {
        return res.json(createSuccessObjectWithData(results));
      }
    }
  );
};
