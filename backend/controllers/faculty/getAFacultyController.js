const dbPool = require("../../dbPool");
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

  let sql = "SELECT * from faculty where facultyID= ?";
  dbPool.query(sql, facultyID.value, (error, results) => {
    if (error) {
      console.log(error);
      res.json(createErrorObject("Error while querying"));
    } else {
      res.json(createSuccessObjectWithData(results[0]));
    }
  });
};
