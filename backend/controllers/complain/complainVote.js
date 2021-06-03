const dbPool = require("../../dbPool");
const {
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../../utils");

module.exports = function (req, res) {
  let voteType = validateNumber(req.body.voteType);
  let studentID = req.user.studentID;
  let complainID = validateNumber(req.params.complainID);

  if (voteType.error || complainID.error) {
    res.json(createErrorObject("Invalid studentID or complainID"));
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
      "SELECT upVote, downVote from complainvote where studentID = ? and complainID = ?";
    connection.query(
      sql,
      [studentID, complainID.value],
      function (error, results) {
        if (error) {
          console.log(error);
          connection.release();
          res.json(createErrorObject("complain voting failed"));
        } else {
          if (results.length == 0) {
            let complainvoteObj;
            let secondsql;
            let msg = "";
            sql = "INSERT into complainvote set ?";

            if (voteType.value == 1) {
              complainvoteObj = {
                complainID: complainID.value,
                studentID: studentID,
                upVote: 1,
                downVote: 0,
              };
              secondsql =
                "Update complain set upVoteSum = upVoteSum + 1 where complainID = ? ";
              msg = "upvoteinsert";
            } else {
              complainvoteObj = {
                complainID: complainID.value,
                studentID: studentID,
                upVote: 0,
                downVote: 1,
              };
              secondsql =
                "Update complain set downVoteSum = downVoteSum + 1 where complainID = ? ";
              4;
              msg = "downvoteinsert";
            }
            connection.query(sql, complainvoteObj, function (error, results) {
              if (error) {
                console.log(error);
                connection.release();
                res.json(createErrorObject("Voting error"));
              } else {
                connection.query(
                  secondsql,
                  [complainID.value],
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
                "UPDATE complainvote set upVote=0 , downVote = 1 where studentID =? and complainID = ?";
              secondSql =
                "UPDATE complain set upVoteSum = upVoteSum - 1 , downVoteSum = downVoteSum + 1 where complainID =?";
              msg = "downvoteupdate";
            } else if (
              results[0].upVote == 0 &&
              results[0].downVote == 1 &&
              voteType.value == 1
            ) {
              //when vote is changed from downVote to upVote
              firstSql =
                "UPDATE complainvote set upVote=1 , downVote = 0 where  studentID =? and complainID =?";
              secondSql =
                "UPDATE complain set upVoteSum = upVoteSum + 1 , downVoteSum = downVoteSum - 1 where complainID =?";
              msg = "upvoteupdate";
            } else {
              connection.release();
              return res.json(createSuccessObject("noupdate"));
            }

            connection.query(
              firstSql,
              [studentID, complainID.value],
              function (error, results) {
                if (error) {
                  console.log(error);
                  connection.release();
                  res.json(createErrorObject("vote not updated"));
                } else {
                  //run second sql here
                  connection.query(
                    secondSql,
                    complainID.value,
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
