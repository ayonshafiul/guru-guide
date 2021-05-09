const db = require("./db");

function courseVerify() {
  let sql =
    "SELECT courseCode, departmentID, max(upVoteSum) as upvote from courseverify group by courseCode, departmentID";
  db.query(sql, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      results.forEach((result) => {
        let secondSql =
          "SELECT courseTitle, downVoteSum from courseverify where courseCode = ? and departmentID = ? and upVoteSum = ?";
        db.query(
          secondSql,
          [result.courseCode, result.departmentID, result.upvote],
          (error, secondResults) => {
            if (error) {
              console.log(error);
            } else {
              if (
                secondResults.length > 0 &&
                secondResults[0].downVoteSum < result.upvote
              ) {
                let thirdSql =
                  "Update course set courseTitle = ? , approved = 1 where courseCode = ? and departmentID = ?";
                db.query(
                  thirdSql,
                  [
                    secondResults[0].courseTitle,
                    result.courseCode,
                    result.departmentID,
                  ],
                  (error, thirdResults) => {
                    if (error) {
                      console.log(error);
                    } else if (thirdResults.affectedRows == 0) {
                      let fourthSql = "INSERT INTO course set ?";
                      let courseObj = {
                        courseTitle: secondResults[0].courseTitle,
                        departmentID: result.departmentID,
                        courseCode: result.courseCode,
                        approved: 1,
                      };
                      db.query(
                        fourthSql,
                        [courseObj],
                        (error, fourthResults) => {
                          if (error) {
                            console.log(error);
                          } else {
                            console.log("Inserted!");
                          }
                        }
                      );
                    } else {
                      console.log("Updated!");
                    }
                  }
                );
              } else if (
                secondResults.length > 0 &&
                secondResults[0].downVoteSum >= result.upvote
              ) {
                let thirdSql =
                  "Update course set approved = 0 where courseCode = ? and departmentID = ?";
                db.query(
                  thirdSql,
                  [result.courseCode, result.departmentID],
                  (error, thirdResults) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Unapproved!");
                    }
                  }
                );
              }
            }
          }
        );
      });
    }
  });
}

module.exports = courseVerify;
