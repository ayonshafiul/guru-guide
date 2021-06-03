const dbPool = require("../../dbPool");
const {
  validateNumber,
  createErrorObject,
  createSuccessObjectWithData,
} = require("../../utils");

module.exports = function (req, res, next) {
  let page = validateNumber(req.query.page);
  if (page.error) {
    return res.json(createErrorObject("Invalid page number!"));
  }

  let sql = "SELECT * from complain order by upVoteSum desc limit ?, 10";

  dbPool.getConnection(function (err, connection) {
    if (err) {
      next(err);
      return;
    }
    connection.query(
      sql,
      [(parseInt(page.value) - 1) * 10],
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
