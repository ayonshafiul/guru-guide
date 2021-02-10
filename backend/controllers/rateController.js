const db = require("../db.js");
const validator = require("validator");
const {createErrorObject, createSuccessObject} = require("../utils");
const { create } = require("hbs");

module.exports = function(req, res){
    
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
        return res.json(createErrorObject("facultyID id invalid"));
    }
    if(validator.isNumeric(req.body.teaching) && numcheck(parseInt(req.body.teaching))){
        teaching = parseInt(req.body.teaching);
    }
    else{
        return res.json(createErrorObject("teaching is invalid"));
    }
    if(validator.isNumeric(req.body.grading) && numcheck(parseInt(req.body.grading))){
        grading = parseInt(req.body.grading);
    }
    else{
        return res.json(createErrorObject("grading is invalid"));
    }
    if(validator.isNumeric(req.body.humanity) && numcheck(parseInt(req.body.humanity))){
        humanity = parseInt(req.body.humanity);
    }
    else{
        return res.json(createErrorObject("humanity is invalid"));
    }
    studentID=34;
    let sql = "SELECT * from rating where studentID = ? and facultyID = ?";
    db.query(sql, [studentID, facultyID], (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.json(createErrorObject("Something went wrong while querying!"));
        } else {
            if (results.length == 0) {
                // no rating exists
                // create new rating instead
                
                insertRating(req, res, {
                    studentID,
                    facultyID,
                    teaching,
                    grading,
                    humanity
                });
            } else {
                // rating already exists
                let oldTeaching = results[0].teaching;
                let oldGrading = results[0].grading;
                let oldHumanity = results[0].humanity;
                
                let sql = "UPDATE rating set teaching = ?, grading = ?, humanity = ? where studentID = ? and facultyID = ?";
                db.query(sql, [teaching, grading, humanity, studentID, facultyID], (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return res.json(createErrorObject("Updating failed with new rating!"));
                    } else {
                        // successfully updated
                        // update the faculty table accordingly
                        let newTeaching = -1 * oldTeaching + teaching;
                        let newGrading = -1 * oldGrading + grading;
                        let newHumanity = -1 * oldHumanity + humanity;
                        
                        let sqlSecond = "UPDATE faculty set teaching = teaching + ?, grading = grading + ?, humanity = humanity + ? where facultyID = ?";
                        
                        db.query(sqlSecond, [newTeaching, newGrading, newHumanity, facultyID], (error, results, fields) => {
                            if (error) {
                                console.log(error);
                                return res.json(createErrorObject("Error while updating voteCount field"));
                            } else {
                                //successfully updated the voteCount field
                                return res.json(createSuccessObject("Successfully inserted new rating!"));
                            }
                        });
                    }
                })
                
                
            }
        }
    })

    function insertRating(req, res, rateObj) {
        let sql = "INSERT INTO rating SET ?";
        db.query(sql, rateObj, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.json(createErrorObject("Query failed! Get a new life!"));
            } else {
                // successfully inserted
                // update all the grading voteCount field in faculty table
                let sqlSecond = "UPDATE faculty set teaching = teaching + ?, grading = grading + ?, humanity = humanity + ?, voteCount = voteCount + 1 where facultyID = ?";
                db.query(sqlSecond, [rateObj.teaching, rateObj.grading, rateObj.humanity, rateObj.facultyID], (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return res.json(createErrorObject("Error while updating voteCount field"));
                    } else {
                        //successfully updated the voteCount field
                        return res.json(createSuccessObject("Successfully inserted new rating!"));
                    }
                });
            }
        });
        
    }
}