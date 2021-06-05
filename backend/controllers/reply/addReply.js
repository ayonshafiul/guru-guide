const dbPool = require("../../dbPool.js");
const {
  validateNumber,
  createErrorObject,
  createSuccessObject,
  validateComment,
} = require("../../utils");

module.exports = function (req, res) {
  let reply = validateComment(req.body.replyText);
  let queryID = validateNumber(req.params.queryID);
  let studentID = req.user.studentID;

  if (reply.error || queryID.error) {
    return res.json(createErrorObject("Invalid reply or qid"));
  }

  dbPool.getConnection(function (err, connection) {
    if (err) {
      next(err);
      return;
    }
    let sql = "INSERT INTO reply SET ?";
    let replyObj = {
      queryID: queryID.value,
      replyText: reply.value,
    };

    connection.query(sql, replyObj, (error, results, fields) => {
      if (error) {
        console.log(error);
        connection.release();
        res.json(createErrorObject("Error while inserting reply"));
      } else {
        let updateSql =
          "UPDATE query set replyCount = replyCount + 1 where queryID = ?";
        connection.query(
          updateSql,
          [queryID.value],
          (error, results, fields) => {
            if (error) {
              console.log(error);
              res.json(createErrorObject("Error while inserting reply"));
            } else {
              res.json(createSuccessObject("Successfully inserted."));
            }
            connection.release();
          }
        );
      }
    });
  });
};
