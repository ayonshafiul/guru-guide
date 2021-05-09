const db = require("../db");
const { createErrorObject, createSuccessObjectWithData } = require("../utils");
const validator = require("validator");
const { validateNumber } = require("../utils");

module.exports = function (req, res) {
  let facultyID = validateNumber(req.params.facultyID);

  if (facultyID.error) {
    return res.json(createErrorObject("Invalid facultyID"));
  }

  let sql = "SELECT * from faculty where facultyID= ?";
  db.query(sql, facultyID.value, (error, results) => {
    if (error) {
      console.log(error);
      return res.json(createErrorObject("Error while querying"));
    } else {
      return res.json(createSuccessObjectWithData(results[0]));
    }
  });
};
