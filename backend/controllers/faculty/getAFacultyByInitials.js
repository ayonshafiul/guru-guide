const dbPool = require("../../dbPool");
const {
  createErrorObject,
  createSuccessObjectWithData,
  validateInitials,
} = require("../../utils");

module.exports = function (req, res, next) {
  let facultyInitials = validateInitials(req.params.facultyInitials);
  if (facultyInitials.error) {
    return res.json(createErrorObject("Invalid Initials"));
  }
  dbPool.getConnection(function (err, connection) {
    if (err) {
      next(err);
      return;
    }

    let sql =
      "SELECT facultyID, facultyName, facultyInitials from faculty where facultyInitials = ";
    connection.query(sql, facultyInitials.value, (error, results) => {
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
