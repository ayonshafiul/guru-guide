const db = require("../../db.js");
const {
  validateComment,
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../../utils");

module.exports = function (req, res) {
  let comment = validateComment(req.body.comment);
  let facultyID = validateNumber(req.params.facultyID);
  let courseID = validateNumber(req.params.courseID);
  let studentID = req.user.studentID;

  if (facultyID.error || comment.error || courseID.error) {
    return res.json(createErrorObject("Invalide comment or facultyID"));
  }

  let sql =
    "UPDATE comment SET commentText = ? where facultyID = ? and courseID = ? and studentID = ?";
  db.query(
    sql,
    [comment.value + " (*Edited*)", facultyID.value, courseID.value, studentID],
    (error, results, fields) => {
      if (error) {
        console.log(error);
        return res.json(
          createErrorObject("Something bad happened while updating!")
        );
      } else if (results.affectedRows == 0) {
        let sql = "INSERT INTO comment SET ?";
        let commentObj = {
          studentID,
          facultyID: facultyID.value,
          courseID: courseID.value,
          commentText: comment.value,
        };

        db.query(sql, commentObj, (error, results, fields) => {
          if (error) {
            console.log(error);
            res.json(createErrorObject("Error while inserting comment"));
          } else {
            return res.json(createSuccessObject("Successfully Inserted!"));
          }
        });
      } else {
        return res.json(createSuccessObject("Updated successfully!"));
      }
    }
  );
};
