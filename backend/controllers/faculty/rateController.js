const db = require("../../db.js");
const {
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../../utils");

function isInvalidRating(x) {
  if (x >= 0 && x <= 10) {
    return false;
  } else {
    return true;
  }
}

module.exports = function (req, res) {
  let teaching = validateNumber(req.body.teaching);
  let grading = validateNumber(req.body.grading);
  let humanity = validateNumber(req.body.humanity);
  let facultyID = validateNumber(req.params.facultyID);
  let studentID = req.user.studentID;
  if (teaching.error || grading.error || humanity.error || facultyID.error) {
    return res.json(createErrorObject("Invalid rating or facultyID"));
  }
  if (
    isInvalidRating(teaching.value) ||
    isInvalidRating(grading.value) ||
    isInvalidRating(humanity.value)
  ) {
    return res.json(createErrorObject("Invalid rating"));
  }

  let sql = "SELECT * from rating where studentID = ? and facultyID = ?";
  db.query(sql, [studentID, facultyID.value], (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.json(
        createErrorObject("Something went wrong while querying!")
      );
    } else {
      if (results.length == 0) {
        // no rating exists
        // create new rating instead

        insertRating(req, res, {
          studentID,
          facultyID: facultyID.value,
          teaching: teaching.value,
          grading: grading.value,
          humanity: humanity.value,
        });
      } else {
        // rating already exists
        let oldTeaching = results[0].teaching;
        let oldGrading = results[0].grading;
        let oldHumanity = results[0].humanity;

        let sql =
          "UPDATE rating set teaching = ?, grading = ?, humanity = ? where studentID = ? and facultyID = ?";
        db.query(
          sql,
          [
            teaching.value,
            grading.value,
            humanity.value,
            studentID,
            facultyID.value,
          ],
          (error, results, fields) => {
            if (error) {
              console.log(error);
              return res.json(
                createErrorObject("Updating failed with new rating!")
              );
            } else {
              // successfully updated
              // update the faculty table accordingly
              let newTeaching = -1 * oldTeaching + teaching.value;
              let newGrading = -1 * oldGrading + grading.value;
              let newHumanity = -1 * oldHumanity + humanity.value;

              let sqlSecond =
                "UPDATE faculty set teaching = teaching + ?, grading = grading + ?, humanity = humanity + ? where facultyID = ?";

              db.query(
                sqlSecond,
                [newTeaching, newGrading, newHumanity, facultyID],
                (error, results, fields) => {
                  if (error) {
                    console.log(error);
                    return res.json(
                      createErrorObject("Error while updating voteCount field")
                    );
                  } else {
                    //successfully updated the voteCount field
                    return res.json(
                      createSuccessObject("Successfully inserted new rating!")
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  });

  function insertRating(req, res, rateObj) {
    let sql = "INSERT INTO rating SET ?";
    db.query(sql, rateObj, (error, results, fields) => {
      if (error) {
        console.log(error);
        res.json(createErrorObject("Query failed! Get a new life!"));
      } else {
        // successfully inserted
        // update all the grading voteCount field in faculty table
        let sqlSecond =
          "UPDATE faculty set teaching = teaching + ?, grading = grading + ?, humanity = humanity + ?, voteCount = voteCount + 1 where facultyID = ?";
        db.query(
          sqlSecond,
          [
            rateObj.teaching,
            rateObj.grading,
            rateObj.humanity,
            rateObj.facultyID,
          ],
          (error, results, fields) => {
            if (error) {
              console.log(error);
              return res.json(
                createErrorObject("Error while updating voteCount field")
              );
            } else {
              //successfully updated the voteCount field
              return res.json(
                createSuccessObject("Successfully inserted new rating!")
              );
            }
          }
        );
      }
    });
  }
};
