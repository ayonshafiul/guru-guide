const dbPool = require("../../dbPool");
const {
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../../utils");

module.exports = function (req, res, next) {
  let voteType = validateNumber(req.body.voteType);
  let studentID = req.user.studentID;
  let commentID = validateNumber(req.params.commentID);

  if (voteType.error || commentID.error) {
    return res.json(createErrorObject("Invalid studentID or commentID"));
  }

  if (voteType.value != 1 && voteType.value != 0) {
    return res.json(createErrorObject("Vote not valid!"));
  }

  // 1 means upvote
  // 0 means downvote

  //************************************************** */

  dbPool.getConnection(function (err, connection) {
    if (err) {
      next(err);
      return;
    }
    let sql =
      "SELECT upVote, downVote from coursecommentvote where studentID = ?  and commentID = ?";
    connection.query(
      sql,
      [studentID, commentID.value],
      function (error, results) {
        if (error) {
          console.log(error);
          connection.release();
          res.json(createErrorObject("comment voting failed"));
        } else {
          if (results.length == 0) {
            let commentratingObj;
            let secondsql;
            let msg = "";
            sql = "INSERT into coursecommentvote set ?";

            if (voteType.value == 1) {
              commentratingObj = {
                commentID: commentID.value,
                studentID: studentID,
                upVote: 1,
                downVote: 0,
              };
              secondsql =
                "Update coursecomment set upVoteSum = upVoteSum + 1 where commentID = ? ";
              msg = "upvoteinsert";
            } else {
              commentratingObj = {
                commentID: commentID.value,
                studentID: studentID,
                upVote: 0,
                downVote: 1,
              };
              secondsql =
                "Update coursecomment set downVoteSum = downVoteSum + 1 where commentID = ? ";
              4;
              msg = "downvoteinsert";
            }
            connection.query(sql, commentratingObj, function (error, results) {
              if (error) {
                console.log(error);
                connection.release();
                res.json(createErrorObject("Voting error"));
              } else {
                connection.query(
                  secondsql,
                  [commentID.value],
                  function (error, results) {
                    if (error) {
                      console.log(error);
                      res.json(createErrorObject("vote not inserted"));
                    } else {
                      res.json(createSuccessObject(msg));
                    }
                    connection.release();
                  }
                );
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
                "UPDATE coursecommentvote set upVote=0 , downVote = 1 where studentID =? and commentID = ?";
              secondSql =
                "UPDATE coursecomment set upVoteSum = upVoteSum - 1 , downVoteSum = downVoteSum + 1 where commentID =?";
              msg = "downvoteupdate";
            } else if (
              results[0].upVote == 0 &&
              results[0].downVote == 1 &&
              voteType.value == 1
            ) {
              //when vote is changed from downVote to upVote
              firstSql =
                "UPDATE coursecommentvote set upVote=1 , downVote = 0 where studentID =? and commentID = ?";
              secondSql =
                "UPDATE coursecomment set upVoteSum = upVoteSum + 1 , downVoteSum = downVoteSum - 1 where commentID =?";
              msg = "upvoteupdate";
            } else {
              connection.release();
              return res.json(createSuccessObject("noupdate"));
            }

            connection.query(
              firstSql,
              [studentID, commentID.value],
              function (error, results) {
                if (error) {
                  console.log(error);
                  connection.release();
                  res.json(createErrorObject("vote not updated"));
                } else {
                  //run second sql here
                  connection.query(
                    secondSql,
                    commentID.value,
                    function (error, results) {
                      if (error) {
                        console.log(error);
                        res.json(createErrorObject("voteSum not updated"));
                      } else {
                        res.json(createSuccessObject(msg));
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
