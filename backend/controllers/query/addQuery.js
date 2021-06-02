const dbPool = require("../../dbPool.js");
const {
  validateComplaint,
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../../utils");

module.exports = function (req, res) {
  let query = validateComplaint(req.body.queryText);
  let studentID = req.user.studentID;

  if (query.error) {
    return res.json(createErrorObject("Invalid query"));
  }

  dbPool.getConnection(function (err, connection) {
    if (err) return res.json(createErrorObject("Can not establish connection"));
    let sql = "INSERT INTO query SET ?";
    let queryObj = {
      studentID,
      queryText: query.value,
    };

    connection.query(sql, queryObj, (error, results, fields) => {
      if (error) {
        console.log(error);
        res.json(createErrorObject("Error while inserting query"));
      } else {
        res.json(createSuccessObject("Successfully Inserted!"));
      }
    });
    connection.release();
  });
};
