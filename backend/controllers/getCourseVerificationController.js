const db = require("../db");
const { createErrorObject, createSuccessObjectWithData } = require("../utils");
const {validateNumber} = require("../utils");

module.exports = function (req, res) {
  const departmentID = validateNumber(req.params.departmentID);
  if(departmentID.error) {
    return res.json(createErrorObject("Invalid departmentID"));
  }
  
  let sql =
    "SELECT courseCode, departmentID from courseverify where departmentID = ? group by courseCode, departmentID";
  db.query(sql, departmentID.value, (error, results) => {
    if (error) {
      console.log(error);
      return res.json(createErrorObject("Error while querying"));
    } else {
      return res.json(createSuccessObjectWithData(results));
    }
  });
};
