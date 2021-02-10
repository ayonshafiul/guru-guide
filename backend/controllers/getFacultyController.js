const db = require("../db");
const { createErrorObject, createSuccessObjectWithData } = require("../utils");

module.exports = function (req, res) {
  let sql = "SELECT * from faculty";
  db.query(sql, (error, results) => {
    if (error) {
      console.log(error);
      return res.json(createErrorObject("Error while querying"));
    } else {
      return res.json(createSuccessObjectWithData(results));
    }
  });
};
