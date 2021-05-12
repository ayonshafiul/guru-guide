const db = require("../../db");
const {
  validateNumber,
  createErrorObject,
  createSuccessObjectWithData,
} = require("../../utils");

module.exports = function (req, res, next) {
  let facultyID = validateNumber(req.params.facultyID);

  if (facultyID.error) {
    return res.json(createErrorObject("Invalid facultyID"));
  }

  let sql = "SELECT * from comment where facultyID = ?";

  db.query(sql, facultyID.value, (error, results) => {
    if (error) {
      console.log(error);
      return res.json(createErrorObject("Error while querying"));
    } else {
      return res.json(createSuccessObjectWithData(results));
    }
  });
};
