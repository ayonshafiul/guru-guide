const dbPool = require("../../dbPool");
const {
  validateNumber,
  createErrorObject,
  createSuccessObjectWithData,
} = require("../../utils");

module.exports = function (req, res, next) {
  let page = validateNumber(req.query.page);
  let queryID = validateNumber(req.params.queryID);

  if (page.error || queryID.error) {
    return res.json(createErrorObject("Invalid qid or page"));
  }

  dbPool.getConnection(function (err, connection) {
    if (err) {
      next(err);
      return;
    }
    let sql =
      "SELECT * from reply where queryID = ? order by replyID limit ?, 10";

    connection.query(
      sql,
      [queryID.value, (parseInt(page.value) - 1) * 10],
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
