const db = require("../db");
const validator = require("validator");

module.exports = (req, res) => {
    function errorObj(msg) {
       return { "success": "false", error: msg}
    }
    function successObj(msg) {
        return { "success": "true", error: msg}
     }
    let facultyID;
    let voteType;
    let studentID = 2; //TODO: authenticate student and use that authenticated studentID
    if (validator.isNumeric(req.params.facultyID)) {
        facultyID = parseInt(req.params.facultyID);
    } else {
        return res.json(errorObj("facultyID not valid!"));
    }
    if (validator.isNumeric(req.params.voteType)) {
        voteType = parseInt(req.params.voteType);
        console.log("voteType", voteType);
        if (voteType != 1 && voteType != 0) {
            return res.json(errorObj("Vote not valid!"));
        }
    } else {
        return res.json(errorObj("Vote not valid!"));
    }
    // 1 means upvote
    // 0 means downvote
    let sql;
    let values;
    if (voteType == 1) {
        sql = "UPDATE vote SET upVote = ?, downVote = ? where studentID = ? and facultyID = ?";
        values = [1, 0, studentID, facultyID];
    } else if ( voteType == 0) {
        sql = "UPDATE vote SET upVote = ?, downVote = ? where studentID = ? and facultyID = ?";
        values = [0, 1, studentID, facultyID];
    }

    db.query(sql, values, (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.json(errorObj("Something bad happened while updating!"));
        } else if (results.affectedRows == 0) {
            let sql = "INSERT INTO vote SET ?";
            let voteObj;
            if (voteType == 1) {
                voteObj = {
                    studentID,
                    facultyID,
                    upVote: 1,
                    downVote: 0
                };
            } else if (voteType == 0) {
                voteObj = {
                    studentID,
                    facultyID,
                    upVote: 0,
                    downVote: 1
                };
            }

            db.query(sql, voteObj, (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.json(errorObj("Query failed! Get a new life!"));
                } else {
                    return res.json(successObj("Inserted!"));
                }
            });
        } else {
            return res.json(successObj("Updated successfully!"));
        }
    });
}