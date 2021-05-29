const db = require("../../db");
const {
  validateNumber,
  createErrorObject,
  createSuccessObjectWithData,
} = require("../../utils");

module.exports = function (req, res, next) {
  let facultyID = validateNumber(req.params.facultyID);
  let courseID = validateNumber(req.params.courseID);
  let page = validateNumber(req.query.page);

  if (facultyID.error || courseID.error || page.error) {
    return res.json(createErrorObject("Invalid facultyID or page"));
  }

  let sql =
    "SELECT * from comment where facultyID = ? and courseID = ? order by upVoteSum desc limit ?, 10";

  db.query(
    sql,
    [facultyID.value, courseID.value, (parseInt(page.value) - 1) * 10],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.json(createErrorObject("Error while querying"));
      } else {
        return res.json(createSuccessObjectWithData(results));
      }
    }
  );
};
