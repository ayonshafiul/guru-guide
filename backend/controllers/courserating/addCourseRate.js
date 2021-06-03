const dbPool = require("../../dbPool.js");
const {
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../../utils");

function isInvalidRating(x) {
  if (x >= 1 && x <= 10) {
    return false;
  } else {
    return true;
  }
}

module.exports = function (req, res, next) {
  let difficulty = validateNumber(req.body.difficulty);
  let courseID = validateNumber(req.params.courseID);
  let studentID = req.user.studentID;
  if (difficulty.error || courseID.error) {
    return res.json(createErrorObject("Invalid difficulty or courseID"));
  }
  if (isInvalidRating(difficulty.value)) {
    return res.json(createErrorObject("Invalid rating"));
  }
  dbPool.getConnection(function (err, connection) {
    if (err) {
      next(err);
      return;
    }
    let sql = "SELECT * from courserating where studentID = ? and courseID = ?";
    connection.query(
      sql,
      [studentID, courseID.value],
      (error, results, fields) => {
        if (error) {
          console.log(error);
          connection.release();
          res.json(createErrorObject("Something went wrong!"));
        } else {
          if (results.length == 0) {
            // no rating exists
            // create new rating instead
            let sql = "INSERT INTO courserating SET ?";
            let rateObj = {
              courseID: courseID.value,
              difficulty: difficulty.value,
              studentID,
            };
            connection.query(sql, rateObj, (error, results, fields) => {
              if (error) {
                console.log(error);
                connection.release();
                res.json(createErrorObject("Error inserting new rating."));
              } else {
                // successfully inserted
                // update all the grading voteCount field in faculty table
                let sqlSecond =
                  "UPDATE course set difficulty = difficulty + ?, rateCount = rateCount + 1 where courseID = ?";
                connection.query(
                  sqlSecond,
                  [difficulty.value, courseID.value],
                  (error, results, fields) => {
                    if (error) {
                      console.log(error);
                      res.json(
                        createErrorObject(
                          "Error while updating voteCount field"
                        )
                      );
                    } else {
                      //successfully updated the voteCount field
                      res.json(
                        createSuccessObject("Successfully inserted new rating!")
                      );
                    }
                    connection.release();
                  }
                );
              }
            });
          } else {
            // rating already exists
            let oldDifficulty = results[0].difficulty;

            let sql =
              "UPDATE courserating set difficulty = ? where  studentID = ? and courseID = ?";
            connection.query(
              sql,
              [difficulty.value, studentID, courseID.value],
              (error, results, fields) => {
                if (error) {
                  console.log(error);
                  connection.release();
                  res.json(
                    createErrorObject("Updating failed with new rating!")
                  );
                } else {
                  // successfully updated
                  // update the course table accordingly
                  let newDifficulty = difficulty.value - oldDifficulty;
                  let sqlSecond =
                    "UPDATE course set difficulty = difficulty + ? where courseID = ?";
                  connection.query(
                    sqlSecond,
                    [newDifficulty, courseID.value],
                    (error, results, fields) => {
                      if (error) {
                        console.log(error);
                        res.json(createErrorObject("Updating failed!"));
                      } else {
                        res.json(createSuccessObject("Updated new rating!"));
                      }
                      connection.release();
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  });
};
