const dbPool = require("../../dbPool");
const {
  validateNumber,
  createErrorObject,
  createSuccessObjectWithData,
} = require("../../utils");

module.exports = function (req, res, next) {
  let studentID = req.user.studentID;

  dbPool.getConnection(function (err, connection) {
    if (err) return res.json(createErrorObject("Can not establish connection"));

    let sql = "SELECT * from query where studentID = ?";

    connection.query(sql, [studentID], (error, results) => {
      if (error) {
        console.log(error);
        return res.json(createErrorObject("Error while querying"));
      } else {
        return res.json(createSuccessObjectWithData(results));
      }
    });
    connection.release();
  });
};
