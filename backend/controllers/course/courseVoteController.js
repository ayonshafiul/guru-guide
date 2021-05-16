const db = require("../../db");
const {
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../../utils");

module.exports = function (req, res) {
  let voteType = validateNumber(req.body.voteType);
  let studentID = req.user.studentID;
  let courseID = validateNumber(req.params.courseID);

  if (voteType.error || courseID.error) {
    console.log(voteType, courseID);
    return res.json(createErrorObject("Invalid studentID or courseID"));
  }

  if (voteType.value != 1 && voteType.value != 0) {
    return res.json(createErrorObject("Vote not valid!"));
  }

  // 1 means upvote
  // 0 means downvote

  //************************************************** */

  let sql =
    "SELECT courseID, studentID, upVote, downVote from coursevote where courseID = ? AND studentID = ?";
  db.query(sql, [courseID.value, studentID], function (error, results) {
    if (error) {
      console.log(error);
      return res.json(createErrorObject("comment voting failed"));
    } else {
      if (results.length == 0) {
        let commentratingObj;
        let secondsql;
        sql = "INSERT into coursevote set ?";
        let msg = "";
        if (voteType.value == 1) {
          commentratingObj = {
            courseID: courseID.value,
            studentID: studentID,
            upVote: 1,
            downVote: 0,
          };
          secondsql =
            "Update courseverify set upVoteSum = upVoteSum + 1 where courseID = ? ";
          msg = "upvoteinsert";
        } else {
          commentratingObj = {
            courseID: courseID.value,
            studentID: studentID,
            upVote: 0,
            downVote: 1,
          };
          secondsql =
            "Update courseverify set downVoteSum = downVoteSum + 1 where courseID = ? ";
          msg = "downvoteinsert";
        }
        db.query(sql, commentratingObj, function (error, results) {
          if (error) {
            console.log(error);
            res.json(createErrorObject("Voting error"));
          } else {
            db.query(secondsql, [courseID.value], function (error, results) {
              if (error) {
                console.log(error);
                res.json(createErrorObject("vote not inserted"));
              } else {
                res.json(createSuccessObject(msg));
              }
            });
          }
        });
      } else {
        let firstSql;
        let secondSql;
        let msg = "";
        if (
          results[0].upVote == 1 &&
          results[0].downVote == 0 &&
          voteType.value == 0
        ) {
          //when vote is changed from upVote to downVote
          firstSql =
            "UPDATE coursevote set upVote=0 , downVote = 1 where courseID =? and studentID =?";
          secondSql =
            "UPDATE courseverify set upVoteSum = upVoteSum - 1 , downVoteSum = downVoteSum + 1 where courseID =?";
          msg = "downvoteupdate";
        } else if (
          results[0].upVote == 0 &&
          results[0].downVote == 1 &&
          voteType.value == 1
        ) {
          //when vote is changed from downVote to upVote
          firstSql =
            "UPDATE coursevote set upVote=1 , downVote = 0 where courseID =? and studentID =?";
          secondSql =
            "UPDATE courseverify set upVoteSum = upVoteSum + 1 , downVoteSum = downVoteSum - 1 where courseID =?";
          msg = "upvoteupdate";
        } else {
          return res.json(createSuccessObject("noupdate"));
        }

        db.query(
          firstSql,
          [courseID.value, studentID],
          function (error, results) {
            if (error) {
              console.log(error);
              res.json(createErrorObject("vote not updated"));
            } else {
              //run second sql here
              db.query(secondSql, courseID.value, function (error, results) {
                if (error) {
                  console.log(error);
                  res.json(createErrorObject("voteSum not updated"));
                } else {
                  res.json(createSuccessObject(msg));
                }
              });
            }
          }
        );
      }
    }
  });
};
