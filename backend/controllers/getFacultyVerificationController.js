const db = require("../db");
const { createErrorObject, createSuccessObjectWithData } = require("../utils");

module.exports = function (req, res) {
  const departmentID = parseInt(req.params.departmentID);

  if (typeof departmentID !== "number") {
    return res.json(createErrorObject("Invalid departmentID"));
  }

  let sql =
    "SELECT facultyInitials, departmentID from facultyverify where departmentID = ? group by facultyInitials, departmentID";
  db.query(sql, departmentID, (error, results) => {
    if (error) {
      console.log(error);
      return res.json(createErrorObject("Error while querying"));
    } else {
      return res.json(createSuccessObjectWithData(results));
    }
  });
};
