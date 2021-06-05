const dbPool = require("../../dbPool");
const {
  validateHex,
  createErrorObject,
  createSuccessObjectWithData,
} = require("../../utils");

module.exports = function (req, res, next) {
  let facultyID = validateHex(req.params.facultyID);
  if (facultyID.error) {
    return res.json(createErrorObject("Invalid hex"));
  }
  dbPool.getConnection(function (err, connection) {
    if (err) {
      next(err);
      return;
    }

    let sql =
      "SELECT facultyID, facultyName, facultyInitials, departmentID, teaching, grading, friendliness, voteCount from faculty where fuid=UUID_TO_BIN(?)";
    connection.query(sql, facultyID, (error, results) => {
      if (error) {
        console.log(error);
        res.json(createErrorObject("Error while querying"));
      } else {
        res.json(createSuccessObjectWithData(results[0]));
      }
      connection.release();
    });
  });
};
