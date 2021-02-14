const db = require("../db");
const { createErrorObject, createSuccessObjectWithData } = require("../utils");
const validator = require("validator");

module.exports = function (req, res, next){
    let facultyID ;
    if (validator.isNumeric(req.params.facultyID)) {
        facultyID = parseInt(req.params.facultyID);
      } else {
        return res.json(createErrorObject("invalid id"));
      }
    let sql = "SELECT * from comment where facultyID = ?";



  db.query(sql,req.params.facultyID, (error, results) => {
    if (error) {
      console.log(error);
      return res.json(createErrorObject("Error while querying"));
    } else {
      
      return res.json(createSuccessObjectWithData(results));
    }
  });

}