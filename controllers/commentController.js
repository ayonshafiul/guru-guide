const db = require("../db.js");
const validator = require("validator");

module.exports = function(req, res) {
    function errorObj(msg) {
        return { "success": "false", error: msg}
     }
     function successObj(msg) {
         return { "success": "true", error: msg}
      }
    let comment;
    let facultyID;
    let studentID;
    if (validator.isNumeric(req.params.facultyID)) {
        facultyID = parseInt(req.params.facultyID);
    } else {
        return res.json(errorObj("facultyID not valid!"));
    }
    // if(validator.isAlphanumeric(req.body.comment,{ignore:" "})){
         comment = req.body.comment;
    // }
    // else{
    //     return res.json(errorObj("Comment cannot contain special characters"));
    // }
    studentID=1;
    let sql = "UPDATE comment SET comment=? where studentID = ? and facultyID = ?";
    db.query(sql, [comment, studentID, facultyID], (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.json(errorObj("Something bad happened while updating!"));
        } else if (results.affectedRows == 0) {
            let sql = "INSERT INTO comment SET ?";
            let commentObj = {
                studentID,
                facultyID,
                comment
            };

            db.query(sql, commentObj, (error, results, fields) => {
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