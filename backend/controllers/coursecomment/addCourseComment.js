const dbPool = require("../../dbPool.js");
const {
  validateComment,
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../../utils");

module.exports = function (req, res) {
  let comment = validateComment(req.body.comment);
  let courseID = validateNumber(req.params.courseID);
  let studentID = req.user.studentID;

  if (comment.error || courseID.error) {
    return res.json(createErrorObject("Invalide comment or courseID"));
  }

  dbPool.getConnection(function (err, connection) {
    if (err) return res.json(createErrorObject("Can not establish connection"));

    let sql =
      "UPDATE coursecomment SET commentText = ? where courseID = ? and studentID = ?";
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
          return res.json(
            createErrorObject("Something bad happened while updating!")
          );
        } else if (results.affectedRows == 0) {
          // no comment exist in the db
          // insert new one instead
          let sql = "INSERT INTO coursecomment SET ?";
          let commentObj = {
            studentID,
            courseID: courseID.value,
            commentText: comment.value,
          };

          connection.query(sql, commentObj, (error, results, fields) => {
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
    connection.release();
  });
};
