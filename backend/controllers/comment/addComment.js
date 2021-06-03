const dbPool = require("../../dbPool.js");
const {
  validateComment,
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../../utils");

module.exports = function (req, res, next) {
  let comment = validateComment(req.body.comment);
  let facultyID = validateNumber(req.params.facultyID);
  let courseID = validateNumber(req.params.courseID);
  let studentID = req.user.studentID;

  if (facultyID.error || comment.error || courseID.error) {
    return res.json(createErrorObject("Invalide comment or facultyID"));
  }
  dbPool.getConnection(function (err, connection) {
    if (err) {
      next(err);
      return;
    }
    let sql =
      "UPDATE comment SET commentText = ? where facultyID = ? and courseID = ? and studentID = ?";
    connection.query(
      sql,
      [
        comment.value + " (*Edited*)",
        facultyID.value,
        courseID.value,
        studentID,
      ],
      (error, results, fields) => {
        if (error) {
          console.log(error);
          connection.release();
          res.json(createErrorObject("Something bad happened while updating!"));
        } else if (results.affectedRows == 0) {
          let sql = "INSERT INTO comment SET ?";
          let commentObj = {
            studentID,
            facultyID: facultyID.value,
            courseID: courseID.value,
            commentText: comment.value,
          };

          connection.query(sql, commentObj, (error, results, fields) => {
            if (error) {
              console.log(error);
              res.json(createErrorObject("Error while inserting comment"));
            } else {
              res.json(createSuccessObject("Successfully Inserted!"));
            }
            connection.release();
          });
        } else {
          connection.release();
          res.json(createSuccessObject("Updated successfully!"));
        }
      }
    );
  });
};
