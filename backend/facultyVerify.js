const db = require("./db");

function facultyVerify() {
  let sql =
    "SELECT facultyInitials, departmentID, max(upVoteSum) as upvote from facultyverify group by facultyInitials, departmentID";
  db.query(sql, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      results.forEach((result) => {
        let secondSql =
          "SELECT facultyName, downVoteSum from facultyverify where facultyInitials = ? and departmentID = ? and upVoteSum = ?";
        db.query(
          secondSql,
          [result.facultyInitials, result.departmentID, result.upvote],
          (error, secondResults) => {
            if (error) {
              console.log(error);
            } else {
              if (
                secondResults.length > 0 &&
                secondResults[0].downVoteSum < result.upvote
              ) {
                let thirdSql =
                  "Update faculty set facultyName = ? , approved = 1 where facultyInitials = ? and departmentID = ?";
                db.query(
                  thirdSql,
                  [
                    secondResults[0].facultyName,
                    result.facultyInitials,
                    result.departmentID,
                  ],
                  (error, thirdResults) => {
                    if (error) {
                      console.log(error);
                    } else if (thirdResults.affectedRows == 0) {
                      let fourthSql = "INSERT INTO faculty set ?";
                      let facultyObj = {
                        facultyName: secondResults[0].facultyName,
                        departmentID: result.departmentID,
                        facultyInitials: result.facultyInitials,
                        approved: 1,
                      };
                      db.query(
                        fourthSql,
                        [facultyObj],
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
                  "Update faculty set approved = 0 where facultyInitials = ? and departmentID = ?";
                db.query(
                  thirdSql,
                  [result.facultyInitials, result.departmentID],
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

module.exports = facultyVerify;
