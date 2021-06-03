const mysql = require("mysql");
const dbPool = mysql.createPool({
  connectionLimit: 150,
  host: "localhost",
  user: "root",
  password: "mshafiul",
  database: "test5",
});

dbPool.getConnection(function (err, connection) {
  if (err) {
    console.log(err);
    return;
  }
  let sql =
    "SELECT facultyInitials, departmentID, max(upVoteSum) as upvote from facultyverify group by facultyInitials, departmentID";
  connection.query(sql, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      results.forEach((result, index) => {
        let secondSql =
          "SELECT facultyName, downVoteSum from facultyverify where facultyInitials = ? and departmentID = ? and upVoteSum = ?";
        connection.query(
          secondSql,
          [result.facultyInitials, result.departmentID, result.upvote],
          (error, secondResults) => {
            if (error) {
              console.log(error);
            } else {
              if (
                secondResults.length > 0 &&
                secondResults[0].downVoteSum < result.upvote
                /* && result.upvote > 9 */
              ) {
                let thirdSql =
                  "Update faculty set facultyName = ? , approved = 1 where facultyInitials = ? and departmentID = ?";
                connection.query(
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
                      connection.query(
                        fourthSql,
                        [facultyObj],
                        (error, fourthResults) => {
                          if (error) {
                            console.log(error);
                          } else {
                            console.log("Inserted!");
                          }
                          if (index === results.length - 1) {
                            console.log("relaese on insert!");
                            connection.release();
                            return;
                          }
                        }
                      );
                    } else {
                      console.log("Updated!");
                      if (index === results.length - 1) {
                        console.log("relaese on updated");
                        connection.release();
                        return;
                      }
                    }
                  }
                );
              } else if (
                secondResults.length > 0 &&
                secondResults[0].downVoteSum >= result.upvote
              ) {
                let thirdSql =
                  "Update faculty set approved = 0 where facultyInitials = ? and departmentID = ?";
                connection.query(
                  thirdSql,
                  [result.facultyInitials, result.departmentID],
                  (error, thirdResults) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Unapproved!");
                    }
                    if (index === results.length - 1) {
                      console.log("relaese on unapproved");
                      connection.release();
                      return;
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
});

dbPool.getConnection(function (err, connection) {
  if (err) {
    console.log(err);
    return;
  }
  let sql =
    "SELECT courseCode, departmentID, max(upVoteSum) as upvote from courseverify group by courseCode, departmentID";
  connection.query(sql, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      results.forEach((result, index) => {
        let secondSql =
          "SELECT courseTitle, downVoteSum from courseverify where courseCode = ? and departmentID = ? and upVoteSum = ?";
        connection.query(
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
                connection.query(
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
                      connection.query(
                        fourthSql,
                        [courseObj],
                        (error, fourthResults) => {
                          if (error) {
                            console.log(error);
                          } else {
                            console.log("Inserted!");
                          }
                          if (index === results.length - 1) {
                            console.log("relaese on insert course");
                            connection.release();
                            return;
                          }
                        }
                      );
                    } else {
                      console.log("Updated!");
                      if (index === results.length - 1) {
                        console.log("relaese on updated course");
                        connection.release();
                        return;
                      }
                    }
                  }
                );
              } else if (
                secondResults.length > 0 &&
                secondResults[0].downVoteSum >= result.upvote
              ) {
                let thirdSql =
                  "Update course set approved = 0 where courseCode = ? and departmentID = ?";
                connection.query(
                  thirdSql,
                  [result.courseCode, result.departmentID],
                  (error, thirdResults) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Unapproved!");
                    }
                    if (index === results.length - 1) {
                      console.log("relaese on insert course");
                      connection.release();
                      return;
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
});
setTimeout(function () {
  process.exit(0);
}, 40000);
