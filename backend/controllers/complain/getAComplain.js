const dbPool = require("../../dbPool");
const {
  validateNumber,
  createErrorObject,
  createSuccessObjectWithData,
  createSuccessObject,
} = require("../../utils");

module.exports = function (req, res, next) {
  let studentID = req.user.studentID;

  let sql = "SELECT * from complain where studentID = ?";

  dbPool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(sql, [studentID], (error, results) => {
      if (error) {
        console.log(error);
        res.json(createErrorObject("Error while querying"));
      } else {
        res.json(createSuccessObjectWithData(results));
      }
      connection.release();
      return;
    });
  });
};
