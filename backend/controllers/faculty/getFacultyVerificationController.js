const dbPool = require("../../dbPool");
const {
  createErrorObject,
  createSuccessObjectWithData,
} = require("../../utils");
const { validateNumber } = require("../../utils");

module.exports = function (req, res, next) {
  const departmentID = validateNumber(req.params.departmentID);
  if (departmentID.error) {
    return res.json(createErrorObject("Invalid departmentID"));
  }

  let sql =
    "SELECT facultyInitials, departmentID from facultyverify where departmentID = ? group by facultyInitials, departmentID";
  dbPool.query(sql, departmentID.value, (error, results) => {
    if (error) {
      console.log(error);
      res.json(createErrorObject("Error while querying"));
    } else {
      res.json(createSuccessObjectWithData(results));
    }
  });
};
