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
  let teaching = validateNumber(req.body.teaching);
  let grading = validateNumber(req.body.grading);
  let friendliness = validateNumber(req.body.friendliness);
  let courseID = validateNumber(req.body.courseID);
  let facultyID = validateNumber(req.params.facultyID);
  let studentID = req.user.studentID;
  if (
    teaching.error ||
    grading.error ||
    friendliness.error ||
    facultyID.error ||
    courseID.error
  ) {
    return res.json(createErrorObject("Invalid rating or facultyID"));
  }
  if (
    isInvalidRating(teaching.value) ||
    isInvalidRating(grading.value) ||
    isInvalidRating(friendliness.value)
  ) {
    return res.json(createErrorObject("Invalid rating"));
  }

  let sql =
    "SELECT * from rating where facultyID = ? and courseID = ? and studentID = ?";
  dbPool.getConnection(function (err, connection) {
    if (err) {
      next(err);
      return;
    }
    connection.query(
      sql,
      [facultyID.value, courseID.value, studentID],
      (error, results, fields) => {
        if (error) {
          connection.release();
          res.json(createErrorObject("Something went wrong while querying!"));
        } else {
          if (results.length == 0) {
            const rateObj = {
              studentID,
              facultyID: facultyID.value,
              courseID: courseID.value,
              teaching: teaching.value,
              grading: grading.value,
              friendliness: friendliness.value,
            };
            let sql = "INSERT INTO rating SET ?";
            connection.query(sql, rateObj, (error, results, fields) => {
              if (error) {
                connection.release();
                res.json(createErrorObject("Insert Failed!"));
              } else {
                let sqlSecond =
                  "UPDATE faculty set teaching = teaching + ?, grading = grading + ?, friendliness = friendliness + ?, voteCount = voteCount + 1 where facultyID = ?";
                connection.query(
                  sqlSecond,
                  [
                    rateObj.teaching,
                    rateObj.grading,
                    rateObj.friendliness,
                    rateObj.facultyID,
                  ],
                  (error, results, fields) => {
                    if (error) {
                      res.json(
                        createErrorObject("Error while updating voteCount")
                      );
                    } else {
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
            let oldTeaching = results[0].teaching;
            let oldGrading = results[0].grading;
            let oldfriendliness = results[0].friendliness;

            let sql =
              "UPDATE rating set teaching = ?, grading = ?, friendliness = ? where facultyID = ? and courseID = ? and studentID = ?";
            connection.query(
              sql,
              [
                teaching.value,
                grading.value,
                friendliness.value,
                facultyID.value,
                courseID.value,
                studentID,
              ],
              (error, results, fields) => {
                if (error) {
                  connection.release();
                  res.json(
                    createErrorObject("Updating failed with new rating!")
                  );
                } else {
                  let newTeaching = teaching.value - oldTeaching;
                  let newGrading = grading.value - oldGrading;
                  let newfriendliness = friendliness.value - oldfriendliness;
                  let sqlSecond =
                    "UPDATE faculty set teaching = teaching + ?, grading = grading + ?, friendliness = friendliness + ? where facultyID = ?";

                  connection.query(
                    sqlSecond,
                    [newTeaching, newGrading, newfriendliness, facultyID.value],
                    (error, results, fields) => {
                      if (error) {
                        res.json(createErrorObject("Updating voteCount field"));
                      } else {
                        //successfully updated the voteCount field
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
