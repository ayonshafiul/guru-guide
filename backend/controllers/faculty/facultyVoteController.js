const dbPool = require("../../dbPool");
const {
  validateNumber,
  createErrorObject,
  createSuccessObject,
  validateHex,
} = require("../../utils");

module.exports = function (req, res, next) {
  let voteType = validateNumber(req.body.voteType);
  let studentID = req.user.studentID;
  let fuid = validateHex(req.params.fuid);

  if (voteType.error || fuid.error) {
    return res.json(createErrorObject("Invalid studentID or fuid"));
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
      "SELECT fuid, studentID, upVote, downVote from facultyvote where fuid = UUID_TO_BIN(?) AND studentID = ?";
    connection.query(
      sql,
      [fuid.value, studentID],
      function (error, results) {
        if (error) {
          console.log(error);
          connection.release();
          res.json(createErrorObject("comment voting failed"));
        } else {
          if (results.length == 0) {
            let facultyVoteArr;
            let secondsql;
            sql = "INSERT into facultyvote(fuid, studentID, upVote, downVote) values(UUID_TO_BIN(?), ? , ?, ?)";
            let msg = "";
            if (voteType.value == 1) {
              facultyVoteArr = [fuid.value, studentID, 1, 0];
              secondsql =
                "Update faculty set upVoteSum = upVoteSum + 1 where fuid = UUID_TO_BIN(?) ";
              msg = "upvoteinsert";
            } else {
              facultyVoteArr = [fuid.value, studentID, 0, 1];
              secondsql =
                "Update faculty set downVoteSum = downVoteSum + 1 where fuid = UUID_TO_BIN(?) ";
              msg = "downvoteinsert";
            }
            connection.query(sql, facultyVoteArr, function (error, results) {
              if (error) {
                console.log(error);
                connection.release();
                res.json(createErrorObject("Voting error"));
              } else {
                connection.query(
                  secondsql,
                  [fuid.value],
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
                "UPDATE facultyvote set upVote=0 , downVote = 1 where fuid =UUID_TO_BIN(?) and studentID =?";
              secondSql =
                "UPDATE faculty set upVoteSum = upVoteSum - 1 , downVoteSum = downVoteSum + 1 where fuid =UUID_TO_BIN(?)";
              msg = "downvoteupdate";
            } else if (
              results[0].upVote == 0 &&
              results[0].downVote == 1 &&
              voteType.value == 1
            ) {
              //when vote is changed from downVote to upVote
              firstSql =
                "UPDATE facultyvote set upVote=1 , downVote = 0 where fuid =UUID_TO_BIN(?) and studentID =?";
              secondSql =
                "UPDATE faculty set upVoteSum = upVoteSum + 1 , downVoteSum = downVoteSum - 1 where fuid =UUID_TO_BIN(?)";
              msg = "upvoteupdate";
            } else {
              connection.release();
              return res.json(createSuccessObject("noupdate"));
            }

            connection.query(
              firstSql,
              [fuid.value, studentID],
              function (error, results) {
                if (error) {
                  console.log(error);
                  connection.release();
                  res.json(createErrorObject("vote not updated"));
                } else {
                  //run second sql here
                  connection.query(
                    secondSql,
                    fuid.value,
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
