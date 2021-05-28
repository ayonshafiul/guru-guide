const dbPool = require("../../dbPool.js");
const {
  validatecomplain,
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../../utils");

module.exports = function (req, res) {
  let complain = validatecomplain(req.body.complain);
  let studentID = req.user.studentID;

  if (complain.error) {
    return res.json(createErrorObject("Invalide complain or facultyID"));
  }

  let sql = "SELECT complainID from complain where studentID = ?";

  dbPool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(sql, [studentID], (error, results, fields) => {
      if (error) {
        console.log(error);
        res.json(createErrorObject("Something bad happened while updating!"));
      } else if (results.length === 0) {
        // complain doesn't exist
        // insert new one
        let sql = "INSERT INTO complain SET ?";
        let complainObj = {
          studentID,
          complainText: complain.value,
        };

        connection.query(sql, complainObj, (error, results, fields) => {
          if (error) {
            console.log(error);
            res.json(createErrorObject("Error while inserting complain"));
          } else {
            res.json(createSuccessObject("Successfully Inserted!"));
          }
        });
      } else if (results.length > 0) {
        // complain exists
        // update it and delete all the votes
        let sql =
          "Update complain set complainText = ? , upVoteSum = 0, downVoteSum = 0 where studentID = ?";
        let sql2 = "Delete from complainvote where complainID = ?";
        connection.query(
          sql,
          [complain.value, studentID],
          (error1, results1, fields1) => {
            if (error1) {
              console.log(error1);
              res.json(createErrorObject("Error while updating complain"));
            } else {
              connection.query(
                sql2,
                [results[0].complainID],
                (error2, results2, fields2) => {
                  if (error2) {
                    res.json(createErrorObject("Error while deleting!"));
                  } else {
                    res.json(createSuccessObject("Success!"));
                  }
                }
              );
            }
          }
        );
      }
      connection.release();
      return;
    });
  });
};
