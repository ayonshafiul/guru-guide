const dbPool = require("../../dbPool");
const {
  validateNumber,
  createErrorObject,
  createSuccessObjectWithData,
} = require("../../utils");

module.exports = function (req, res, next) {
  let courseID = validateNumber(req.params.courseID);

  if (courseID.error) {
    return res.json(createErrorObject("Invalid courseID"));
  }

  dbPool.getConnection(function (err, connection) {
    if (err) {
      next(err);
      return;
    }
    let sql = "SELECT * from course where courseID= ?";
    connection.query(sql, courseID.value, (error, results) => {
      if (error) {
        console.log(error);
        return res.json(createErrorObject("Error while querying"));
      } else {
        if (results.length > 0)
          res.json(createSuccessObjectWithData(results[0]));
        else res.json(createErrorObject("No data found"));
      }
      connection.release();
    });
  });
};
