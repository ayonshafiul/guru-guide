const dbPool = require("../../dbPool");
const {
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../../utils");

module.exports = function (req, res) {
  let voteType = validateNumber(req.body.voteType);
  let studentID = req.user.studentID;
  let queryID = validateNumber(req.params.queryID);

  if (voteType.error || queryID.error) {
    res.json(createErrorObject("Invalid studentID or queryID"));
  }

  if (voteType.value != 1 && voteType.value != 0) {
    res.json(createErrorObject("Vote not valid!"));
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
      "SELECT upVote, downVote from queryvote where studentID = ? and queryID = ?";
    connection.query(
      sql,
      [studentID, queryID.value],
      function (error, results) {
        if (error) {
          console.log(error);
          res.json(createErrorObject("query voting failed"));
          connection.release();
        } else {
          if (results.length == 0) {
            let queryvoteObj;
            let secondsql;
            let msg = "";
            sql = "INSERT into queryvote set ?";

            if (voteType.value == 1) {
              queryvoteObj = {
                queryID: queryID.value,
                studentID: studentID,
                upVote: 1,
                downVote: 0,
              };
              secondsql =
                "Update query set upVoteSum = upVoteSum + 1 where queryID = ? ";
              msg = "upvoteinsert";
            } else {
              queryvoteObj = {
                queryID: queryID.value,
                studentID: studentID,
                upVote: 0,
                downVote: 1,
              };
              secondsql =
                "Update query set downVoteSum = downVoteSum + 1 where queryID = ? ";
              4;
              msg = "downvoteinsert";
            }
            connection.query(sql, queryvoteObj, function (error, results) {
              if (error) {
                console.log(error);
                res.json(createErrorObject("Voting error"));
                connection.release();
              } else {
                connection.query(
                  secondsql,
                  [queryID.value],
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
                "UPDATE queryvote set upVote=0 , downVote = 1 where studentID =? and queryID = ?";
              secondSql =
                "UPDATE query set upVoteSum = upVoteSum - 1 , downVoteSum = downVoteSum + 1 where queryID =?";
              msg = "downvoteupdate";
            } else if (
              results[0].upVote == 0 &&
              results[0].downVote == 1 &&
              voteType.value == 1
            ) {
              //when vote is changed from downVote to upVote
              firstSql =
                "UPDATE queryvote set upVote=1 , downVote = 0 where  studentID =? and queryID =?";
              secondSql =
                "UPDATE query set upVoteSum = upVoteSum + 1 , downVoteSum = downVoteSum - 1 where queryID =?";
              msg = "upvoteupdate";
            } else {
              connection.release();
              return res.json(createSuccessObject("noupdate"));
            }

            connection.query(
              firstSql,
              [studentID, queryID.value],
              function (error, results) {
                if (error) {
                  console.log(error);
                  res.json(createErrorObject("vote not updated"));
                  connection.release();
                } else {
                  //run second sql here
                  connection.query(
                    secondSql,
                    queryID.value,
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
