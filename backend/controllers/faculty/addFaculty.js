const dbPool = require("../../dbPool.js");
const {
  createErrorObject,
  createSuccessObjectWithData,
  createSuccessObject,
} = require("../../utils");
const {
  validateNumber,
  validateCharactersOnlyWithSpaces,
  validateCharactersOnly,
} = require("../../utils");

module.exports = function addFaculty(req, res, next) {
  let { departmentID, facultyName, facultyInitials } = req.body;
  departmentID = validateNumber(departmentID);
  facultyName = validateCharactersOnlyWithSpaces(facultyName);
  facultyInitials = validateCharactersOnly(facultyInitials);

  if (departmentID.error || facultyInitials.error || facultyName.error) {
    return res.json(
      createErrorObject(
        "Invalid departmentID or facultyInitials or facultyName"
      )
    );
  }

  dbPool.getConnection(function (err, connection) {
    if (err) {
      next(err);
      return;
    }

    let sql =
      "SELECT facultyID, facultyName, facultyInitials from faculty where facultyInitials = ?";

    connection.query(sql, facultyInitials.value, function (error, results) {
      if (error) {
        console.log(error);
        connection.release();
      } else {
        if (results.length == 0) {
          // new faculty
          let sql =
            "INSERT INTO faculty (facultyName, departmentID, facultyInitials, approved, fuid, upVoteSum) values (?, ?, ?, 1, UUID_TO_BIN(UUID(), true), 2)";
          let faculty = {
            departmentID: departmentID.value,
            facultyName: facultyName.value,
            facultyInitials: facultyInitials.value,
            upVoteSum: 2,
            downVoteSum: 0,
          };
          connection.query(
            sql,
            [facultyName.value, departmentID.value, facultyInitials.value],
            function (error, results) {
              if (error) {
                console.log(error);
                res.json(createErrorObject("Error while inserting a faculty"));
              } else {
                res.json(createSuccessObject("Faculty added in faculty!"));
              }
              connection.release();
            }
          );
        } else if (results.length > 0) {
          let firstSql = "INSERT INTO facultyverify SET ?";
          let faculty = {
            departmentID: departmentID.value,
            facultyName: facultyName.value,
            facultyInitials: facultyInitials.value,
            upVoteSum: 2,
          };
          let secondSql =
            "UPDATE faculty set duplicateCount = duplicateCount + 1 where facultyID = ?";
          connection.query(firstSql, faculty, function (error, secondResults) {
            if (error) {
              console.log(error);
              connection.release();
              res.json(createErrorObject("Error while inserting a faculty"));
            } else {
              connection.query(
                secondSql,
                results[0].facultyID,
                function (error, thirdResults) {
                  if (error) {
                    console.log(error);
                    connection.release();
                    res.json(createErrorObject("Error while updating faculty"));
                  } else {
                    res.json(
                      createSuccessObject("Faculty added in facultyverify!")
                    );
                  }
                }
              );
              connection.release();
            }
          });
        }
      }
    });
  });
};
