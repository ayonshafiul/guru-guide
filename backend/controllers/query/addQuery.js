const dbPool = require("../../dbPool.js");
const {
  validateComplaint,
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../../utils");
const client = require("../../redisClient");

module.exports = function (req, res, next) {
  let query = validateComplaint(req.body.queryText);
  let studentID = req.user.studentID;

  if (query.error) {
    return res.json(createErrorObject("Invalid query"));
  }

  client.get("q" + studentID, function (err, value) {
    if (!value) {
      dbPool.getConnection(function (err, connection) {
        if (err) {
          next(err);
          return;
        }
        let sql = "INSERT INTO query SET ?";
        let queryObj = {
          studentID,
          queryText: query.value,
        };

        connection.query(sql, queryObj, (error, results, fields) => {
          if (error) {
            res.json(createErrorObject("Error while inserting query"));
          } else {
            client.setex("q" + studentID, 60, "1", function (err, reply) {});
            res.json(createSuccessObject("Successfully Inserted!"));
          }
        });
      });
    } else {
      res.json(createErrorObject("toosoon"));
    }
  });
};
