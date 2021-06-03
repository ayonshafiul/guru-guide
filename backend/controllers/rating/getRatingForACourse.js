const dbPool = require("../../dbPool");
const client = require("../../redisClient");
const {
  validateNumber,
  createErrorObject,
  createSuccessObjectWithData,
} = require("../../utils");

module.exports = function (req, res, next) {
  let facultyID = validateNumber(req.params.facultyID);
  let courseID = validateNumber(req.params.courseID);
  let studentID = req.user.studentID;

  if (facultyID.error || courseID.error) {
    return res.json(createErrorObject("Invalid facultyID or courseID"));
  }
  client.get(
    "rf" + facultyID.value + "c" + courseID.value,
    function (err, value) {
      if (!value) {
        let sql =
          "SELECT count(*) as voteCount, sum(teaching) as teaching, sum(friendliness) as friendliness, sum(grading) as grading FROM rating WHERE facultyID = ? and courseID = ?";

        dbPool.query(
          sql,
          [facultyID.value, courseID.value],
          (error, results) => {
            if (error) {
              res.json(createErrorObject("Error while querying"));
            } else {
              if (results[0].voteCount == 0) {
                res.json(createErrorObject("no data"));
              } else {
                let { teaching, grading, friendliness, voteCount } = results[0];
                console.log(results[0]);
                client.setex(
                  "rf" + facultyID.value + "c" + courseID.value,
                  60,
                  `${teaching},${grading},${friendliness},${voteCount}`,
                  function (err, reply) {}
                );
                res.json(createSuccessObjectWithData(results[0]));
              }
            }
          }
        );
      } else {
        let arr = value.split(",");
        res.json(
          createSuccessObjectWithData({
            teaching: parseInt(arr[0]),
            grading: parseInt(arr[1]),
            friendliness: parseInt(arr[2]),
            voteCount: parseInt(arr[3]),
          })
        );
      }
    }
  );
};
