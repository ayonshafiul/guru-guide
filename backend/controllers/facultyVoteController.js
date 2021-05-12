const db = require("../db");
const {
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../utils");

module.exports = function (req, res) {
  let voteType = validateNumber(req.params.voteType);
  let studentID = 1; //req.user.studentID;
  let facultyID = validateNumber(req.params.facultyID);

  if (voteType.error || facultyID.error) {
    return res.json(createErrorObject("Invalid studentID or facultyID"));
  }

  if (voteType.value != 1 && voteType.value != 0) {
    return res.json(createErrorObject("Vote not valid!"));
  }

  // 1 means upvote
  // 0 means downvote

  //************************************************** */

  let sql =
    "SELECT facultyID, studentID, upVote, downVote from vote where facultyID = ? AND studentID = ?";
  db.query(sql, [facultyID.value, studentID], function (error, results) {
    if (error) {
      console.log(error);
      return res.json(createErrorObject("comment voting failed"));
    } else {
      if (results.length == 0) {
        let commentratingObj;
        let secondsql;
        sql = "INSERT into commentvote set ?";

        if (voteType.value == 1) {
          commentratingObj = {
            facultyID: facultyID.value,
            studentID: studentID,
            upVote: 1,
            downVote: 0,
          };
          secondsql =
            "Update facultyverify set upVoteSum = upVoteSum + 1 where facultyID = ? ";
        } else {
          commentratingObj = {
            facultyID: facultyID.value,
            studentID: studentID,
            upVote: 0,
            downVote: 1,
          };
          secondsql =
            "Update facultyverify set downVoteSum = downVoteSum + 1 where facultyID = ? ";
        }
        db.query(sql, commentratingObj, function (error, results) {
          if (error) {
            console.log(error);
            res.json(createErrorObject("Voting error"));
          } else {
            db.query(secondsql, [facultyID.value], function (error, results) {
              if (error) {
                console.log(error);
                res.json(createErrorObject("vote not inserted"));
              } else {
                res.json(createSuccessObject("vote inserted successfully"));
              }
            });
          }
        });
      } else {
        let firstSql;
        let secondSql;
        if (
          results[0].upVote == 1 &&
          results[0].downVote == 0 &&
          voteType.value == 0
        ) {
          //when vote is changed from upVote to downVote
          firstSql =
            "UPDATE vote set upVote=0 , downVote = 1 where facultyID =? and studentID =?";
          secondSql =
            "UPDATE facultyverify set upVoteSum = upVoteSum - 1 , downVoteSum = downVoteSum + 1 where facultyID =?";
        } else if (
          results[0].upVote == 0 &&
          results[0].downVote == 1 &&
          voteType.value == 1
        ) {
          //when vote is changed from downVote to upVote
          firstSql =
            "UPDATE vote set upVote=1 , downVote = 0 where facultyID =? and studentID =?";
          secondSql =
            "UPDATE facultyverify set upVoteSum = upVoteSum + 1 , downVoteSum = downVoteSum - 1 where facultyID =?";
        } else {
          return res.json(createSuccessObject("No need to update"));
        }

        db.query(
          firstSql,
          [facultyID.value, studentID],
          function (error, results) {
            if (error) {
              console.log(error);
              res.json(createErrorObject("vote not updated"));
            } else {
              //run second sql here
              db.query(secondSql, facultyID.value, function (error, results) {
                if (error) {
                  console.log(error);
                  res.json(createErrorObject("voteSum not updated"));
                } else {
                  res.json(
                    createSuccessObject("voteSum is updated successfully")
                  );
                }
              });
            }
          }
        );
      }
    }
  });
};
