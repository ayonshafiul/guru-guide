const dbPool = require("../../dbPool");
const {
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../../utils");

module.exports = function (req, res, next) {
  let voteType = validateNumber(req.body.voteType);
  let studentID = req.user.studentID;
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

  dbPool.getConnection(function (err, connection) {
    if (err) {
      next(err);
      return;
    }
    let sql =
      "SELECT facultyID, studentID, upVote, downVote from facultyverifyvote where facultyID = ? AND studentID = ?";
    connection.query(
      sql,
      [facultyID.value, studentID],
      function (error, results) {
        if (error) {
          console.log(error);
          connection.release();
          res.json(createErrorObject("comment voting failed"));
        } else {
          if (results.length == 0) {
            let commentratingObj;
            let secondsql;
            sql = "INSERT into facultyverifyvote set ?";
            let msg = "";
            if (voteType.value == 1) {
              commentratingObj = {
                facultyID: facultyID.value,
                studentID: studentID,
                upVote: 1,
                downVote: 0,
              };
              secondsql =
                "Update facultyverify set upVoteSum = upVoteSum + 1 where facultyID = ? ";
              msg = "upvoteinsert";
            } else {
              commentratingObj = {
                facultyID: facultyID.value,
                studentID: studentID,
                upVote: 0,
                downVote: 1,
              };
              secondsql =
                "Update facultyverify set downVoteSum = downVoteSum + 1 where facultyID = ? ";
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
                  [facultyID.value],
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
                "UPDATE facultyverifyvote set upVote=0 , downVote = 1 where facultyID =? and studentID =?";
              secondSql =
                "UPDATE facultyverify set upVoteSum = upVoteSum - 1 , downVoteSum = downVoteSum + 1 where facultyID =?";
              msg = "downvoteupdate";
            } else if (
              results[0].upVote == 0 &&
              results[0].downVote == 1 &&
              voteType.value == 1
            ) {
              //when vote is changed from downVote to upVote
              firstSql =
                "UPDATE facultyverifyvote set upVote=1 , downVote = 0 where facultyID =? and studentID =?";
              secondSql =
                "UPDATE facultyverify set upVoteSum = upVoteSum + 1 , downVoteSum = downVoteSum - 1 where facultyID =?";
              msg = "upvoteupdate";
            } else {
              connection.release();
              return res.json(createSuccessObject("noupdate"));
            }

            connection.query(
              firstSql,
              [facultyID.value, studentID],
              function (error, results) {
                if (error) {
                  console.log(error);
                  connection.release();
                  res.json(createErrorObject("vote not updated"));
                } else {
                  //run second sql here
                  connection.query(
                    secondSql,
                    facultyID.value,
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
