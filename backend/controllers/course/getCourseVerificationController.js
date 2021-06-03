const dbPool = require("../../dbPool");
const {
  validateNumber,
  createErrorObject,
  createSuccessObjectWithData,
} = require("../../utils");

module.exports = function (req, res) {
  const departmentID = validateNumber(req.params.departmentID);
  if (departmentID.error) {
    return res.json(createErrorObject("Invalid departmentID"));
  }

  let sql =
    "SELECT courseCode, departmentID from courseverify where departmentID = ? group by courseCode, departmentID";
  dbPool.query(sql, departmentID.value, (error, results) => {
    if (error) {
      console.log(error);
      res.json(createErrorObject("Error while querying"));
    } else {
      res.json(createSuccessObjectWithData(results));
    }
  });
};
