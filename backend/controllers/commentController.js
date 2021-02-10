const db = require("../db.js");
const validator = require("validator");
const {validateComment, createErrorObject, createSuccessObject} = require("../utils");


module.exports = function(req, res) {
   
    let comment;
    let facultyID;
    let studentID;
    if (validator.isNumeric(req.params.facultyID)) {
        facultyID = parseInt(req.params.facultyID);
    } else {
        return res.json(createErrorObject("facultyID not valid!"));
    }
    const validationObject = validateComment(req.body.comment);
    if(!validationObject.error) {
       comment = req.body.comment; 
    } else {
        return res.json(createErrorObject("comment is invalid!"));
    }
    
    studentID=5;
    let sql = "UPDATE comment SET comment=? where studentID = ? and facultyID = ?";
    db.query(sql, [comment, studentID, facultyID], (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.json(createErrorObject("Something bad happened while updating!"));
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
                    res.json(createErrorObject("Query failed! Get a new life!"));
                } else {
                    return res.json(createSuccessObject("Inserted!"));
                }
            });
        } else {
            return res.json(createSuccessObject("Updated successfully!"));
        }
    });


}