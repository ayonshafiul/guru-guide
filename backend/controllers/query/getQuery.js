const dbPool = require("../../dbPool");
const {
  validateNumber,
  createErrorObject,
  createSuccessObjectWithData,
} = require("../../utils");

module.exports = function (req, res, next) {
  let page = validateNumber(req.query.page);

  if (page.error) {
    return res.json(createErrorObject("Invalid courseID or page"));
  }

  dbPool.getConnection(function (err, connection) {
    if (err) return res.json(createErrorObject("Can not establish connection"));

    let sql = "SELECT * from query order by queryID desc limit ?, 10";

    connection.query(
      sql,
      [(parseInt(page.value) - 1) * 10],
      (error, results) => {
        if (error) {
          console.log(error);
          return res.json(createErrorObject("Error while querying"));
        } else {
          return res.json(createSuccessObjectWithData(results));
        }
      }
    );
    connection.release();
  });
};
