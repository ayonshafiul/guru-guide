const dbPool = require("../../dbPool");
const {
  validateHex,
  createErrorObject,
  createSuccessObjectWithData,
} = require("../../utils");

module.exports = function (req, res, next) {
  let courseID = validateHex(req.params.courseID);

  if(courseID.error) {
    return res.json(createErrorObject("Invalid hex"));
  }

  dbPool.getConnection(function (err, connection) {
    if (err) {
      next(err);
      return;
    }
    let sql =
      "SELECT courseID, courseTitle, courseCode, departmentID, difficulty, rateCount from course where cuid=UUID_TO_BIN(?)";
    connection.query(sql, courseID.value, (error, results) => {
      if (error) {
        connection.release();
        res.json(createErrorObject("Error while querying"));
      } else {
        if (results.length > 0)
          res.json(createSuccessObjectWithData(results[0]));
        else res.json(createErrorObject("No data found"));
        connection.release();
      }
    });
  });
};
