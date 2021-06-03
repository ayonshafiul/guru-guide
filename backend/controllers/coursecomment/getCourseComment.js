const dbPool = require("../../dbPool");
const {
  validateNumber,
  createErrorObject,
  createSuccessObjectWithData,
} = require("../../utils");

module.exports = function (req, res, next) {
  let courseID = validateNumber(req.params.courseID);
  let page = validateNumber(req.query.page);

  if (courseID.error || page.error) {
    return res.json(createErrorObject("Invalid courseID or page"));
  }

  dbPool.getConnection(function (err, connection) {
    if (err) {
      next(err);
      return;
    }
    let sql =
      "SELECT * from coursecomment where courseID = ? order by upVoteSum desc limit ?, 10";

    connection.query(
      sql,
      [courseID.value, (parseInt(page.value) - 1) * 10],
      (error, results) => {
        if (error) {
          console.log(error);
          res.json(createErrorObject("Error while querying"));
        } else {
          res.json(createSuccessObjectWithData(results));
        }
        connection.release();
      }
    );
  });
};
