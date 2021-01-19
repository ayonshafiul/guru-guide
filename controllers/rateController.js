const db = require("../db.js");
const validator = require("validator");

module.exports = function(req, res){
    function errorObj(msg) {
        return { "success": "false", error: msg}
     }
     function successObj(msg) {
         return { "success": "true", error: msg}
      }
    let teaching;
    let grading;
    let humanity;
    let facultyID;
    function numcheck(x){
        if(x>=0 && x<=10){
            return true;
        }
        else{
            return false;
        }
    }
    if(validator.isNumeric(req.params.facultyID) ){
        facultyID = parseInt(req.params.facultyID);
    }
    else{
        return res.json(errorObj("facultyID id invalid"));
    }
    if(validator.isNumeric(req.body.teaching) && numcheck(parseInt(req.body.teaching))){
        teaching = parseInt(req.body.teaching);
    }
    else{
        return res.json(errorObj("teaching is invalid"));
    }
    if(validator.isNumeric(req.body.grading) && numcheck(parseInt(req.body.grading))){
        grading = parseInt(req.body.grading);
    }
    else{
        return res.json(errorObj("grading is invalid"));
    }
    if(validator.isNumeric(req.body.humanity) && numcheck(parseInt(req.body.humanity))){
        humanity = parseInt(req.body.humanity);
    }
    else{
        return res.json(errorObj("humanity is invalid"));
    }
    studentID=1;
    let sql = "UPDATE rating SET teaching = ?, grading = ?, humanity = ? where studentID = ? and facultyID = ?";
    db.query(sql, [teaching ,grading,humanity, studentID, facultyID], (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.json(errorObj("Something bad happened while updating!"));
        } else if (results.affectedRows == 0) {
            let sql = "INSERT INTO rating SET ?";
            let rateObj = {
                studentID,
                facultyID,
                teaching,
                grading,
                humanity
            };

            db.query(sql, rateObj, (error, results, fields) => {
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