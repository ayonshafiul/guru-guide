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
    if (err)
      if (err) {
        next(err);
        return;
      }
    let sql = "SELECT difficulty, rateCount from course where courseID= ?";
    connection.query(sql, courseID.value, (error, results) => {
      if (error) {
        console.log(error);
        res.json(createErrorObject("Error while querying"));
      } else {
        res.json(createSuccessObjectWithData(results));
      }
      connection.release();
    });
  });
};
