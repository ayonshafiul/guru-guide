const db = require("../db");
const { createErrorObject, createSuccessObjectWithData } = require("../utils");

module.exports = function (req, res) {
  let departmentID = parseInt(req.params.departmentID);
  let facultyInitials = String(req.params.facultyInitials).substring(0, 3);

  if (typeof departmentID !== "number") {
    return res.json(createErrorObject("Invalid departmentID"));
  }

  if (typeof facultyInitials !== "string") {
    return res.json(createErrorObject("Invalid facultyInitials"));
  }

  let sql =
    "SELECT facultyName, facultyInitials, departmentID, upVoteSum, downVoteSum from facultyverify where facultyInitials = ? and departmentID = ?";
  db.query(sql, [facultyInitials, departmentID], (error, results) => {
    if (error) {
      console.log(error);
      return res.json(createErrorObject("Error while querying"));
    } else {
      return res.json(createSuccessObjectWithData(results));
    }
  });
};
