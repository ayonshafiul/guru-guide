const dbPool = require("../../dbPool");
const {
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../../utils");

module.exports = function (req, res) {
  let voteType = validateNumber(req.body.voteType);
  let studentID = req.user.studentID;
  let replyID = validateNumber(req.params.replyID);

  if (voteType.error || replyID.error) {
    res.json(createErrorObject("Invalid studentID or replyID"));
  }

  if (voteType.value != 1 && voteType.value != 0) {
    res.json(createErrorObject("Vote not valid!"));
  }

  // 1 means upvote
  // 0 means downvote

  //************************************************** */

  dbPool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    let sql =
      "SELECT upVote, downVote from replyvote where studentID = ? and replyID = ?";
    connection.query(
      sql,
      [studentID, replyID.value],
      function (error, results) {
        if (error) {
          console.log(error);
          res.json(createErrorObject("reply voting failed"));
        } else {
          if (results.length == 0) {
            let replyvoteObj;
            let secondsql;
            let msg = "";
            sql = "INSERT into replyvote set ?";

            if (voteType.value == 1) {
              replyvoteObj = {
                replyID: replyID.value,
                studentID: studentID,
                upVote: 1,
                downVote: 0,
              };
              secondsql =
                "Update reply set upVoteSum = upVoteSum + 1 where replyID = ? ";
              msg = "upvoteinsert";
            } else {
              replyvoteObj = {
                replyID: replyID.value,
                studentID: studentID,
                upVote: 0,
                downVote: 1,
              };
              secondsql =
                "Update reply set downVoteSum = downVoteSum + 1 where replyID = ? ";
              4;
              msg = "downvoteinsert";
            }
            connection.query(sql, replyvoteObj, function (error, results) {
              if (error) {
                console.log(error);
                res.json(createErrorObject("Voting error"));
              } else {
                connection.query(
                  secondsql,
                  [replyID.value],
                  function (error, results) {
                    if (error) {
                      console.log(error);
                      res.json(createErrorObject("vote not inserted"));
                    } else {
                      res.json(createSuccessObject(msg));
                    }
                  }
                );
              }
            });
          } else {
            // already voted
            // update instead

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
                "UPDATE replyvote set upVote=0 , downVote = 1 where studentID =? and replyID = ?";
              secondSql =
                "UPDATE reply set upVoteSum = upVoteSum - 1 , downVoteSum = downVoteSum + 1 where replyID =?";
              msg = "downvoteupdate";
            } else if (
              results[0].upVote == 0 &&
              results[0].downVote == 1 &&
              voteType.value == 1
            ) {
              //when vote is changed from downVote to upVote
              firstSql =
                "UPDATE replyvote set upVote=1 , downVote = 0 where  studentID =? and replyID =?";
              secondSql =
                "UPDATE reply set upVoteSum = upVoteSum + 1 , downVoteSum = downVoteSum - 1 where replyID =?";
              msg = "upvoteupdate";
            } else {
              return res.json(createSuccessObject("noupdate"));
            }

            connection.query(
              firstSql,
              [studentID, replyID.value],
              function (error, results) {
                if (error) {
                  console.log(error);
                  res.json(createErrorObject("vote not updated"));
                } else {
                  //run second sql here
                  connection.query(
                    secondSql,
                    replyID.value,
                    function (error, results) {
                      if (error) {
                        console.log(error);
                        res.json(createErrorObject("voteSum not updated"));
                      } else {
                        res.json(createSuccessObject(msg));
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );

    connection.release();
    return;
  });
};
