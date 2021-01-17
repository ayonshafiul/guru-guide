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
        if (voteType != 1 && voteType != -1) {
            return res.json(errorObj("Vote not valid!"));
        }
    } else {
        return res.json(errorObj("Vote not valid!"));
    }
    // check if the user already voted?
    let sql = "UPDATE vote SET vote = ? where studentID = ? and facultyID = ?";
    db.query(sql, [voteType, studentID, facultyID], (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.json(errorObj("Something bad happened while updating!"));
        } else if (results.affectedRows == 0) {
            let sql = "INSERT INTO vote SET ?";
            let voteObj = {
                studentID,
                facultyID,
                vote: voteType
            };

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