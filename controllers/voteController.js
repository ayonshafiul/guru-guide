const db = require("../db");
const validator = require("validator");
const e = require("express");

function errorObj(msg) {
    return { "success": "false", error: msg}
}
function successObj(msg) {
     return { "success": "true", error: msg}
}


module.exports = (req, res) => {
    
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
    let selectSql = "SELECT upVote, downVote from vote where studentID = ? and facultyID = ?";

    db.query(selectSql, [studentID, facultyID], (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.json(errorObj("Hoilo na"));
        } else {
            if (results.length == 0) {
                // vote doesn't yet exist 
                // insert new data
                insertData(req, res, facultyID, voteType, studentID);
            } else if (results[0].upVote == 1 && results[0].downVote == 0) { // alredy upvoted  
                if ( voteType == 0) { // only update if vote is changed to downvote
                    // downvoting..
                    sql = "UPDATE vote SET upVote = ?, downVote = ? where studentID = ? and facultyID = ?";
                    values = [0, 1, studentID, facultyID];
                    db.query(sql, values, (error, results, fields) => {
                        if (error) {
                            console.log(error);
                            return res.json(errorObj("Downvoting failed!"));
                        } else { // updating successful
                            // update the total sum
                            let sql = "UPDATE faculty set upVoteSum = upVoteSum - 1, downVoteSum = downVoteSum + 1 where facultyID = ?";
                            db.query(sql, facultyID, (error, results, fields) => {
                                if(error) {
                                    console.log(error);
                                    return res.json(errorObj("Updating the sum after downvoting failed!"));
                                } else {
                                    // sum updated successfully
                                    return res.json(results);
                                }
                            });
                        }
                    });
                } else {
                    return res.json(errorObj("no need to upvote as alredy upvote exists!"));
                }
            } else if ( results[0].upVote == 0 && results[0].downVote == 1) { // already downvoted
                if (voteType == 1) { // only update if vote is changed to upvote
                    // upvoting...
                    sql = "UPDATE vote SET upVote = ?, downVote = ? where studentID = ? and facultyID = ?";
                    values = [1, 0, studentID, facultyID];
                    db.query(sql, values, (error, results, fields) => {
                        if (error) {
                            console.log(error);
                            return res.json(errorObj("Upvoting failed!"));
                        } else { // updating successful
                            // update the total sum
                            let sql = "UPDATE faculty set upVoteSum = upVoteSum + 1, downVoteSum = downVoteSum - 1 where facultyID = ?";
                            db.query(sql, facultyID, (error, results, fields) => {
                                if(error) {
                                    console.log(error);
                                    return res.json(errorObj("Updating the sum after upvoting failed!"));
                                } else {
                                    // sum updated successfully
                                    return res.json(results);
                                }
                            });
                        }
                    });
                } else {
                    return res.json(errorObj("No need to downvote as downvote exists"));
                }
            }
        }
    })  
}


function insertData(req, res, facultyID, voteType, studentID) {
    let sql = "INSERT INTO vote SET ?";
    let sumSql;
    let voteObj;
    if (voteType == 1) {
        voteObj = {
            studentID,
            facultyID,
            upVote: 1,
            downVote: 0
        };
        sumSql = "UPDATE faculty set upVoteSum = upVoteSum + 1 where facultyID = ?";

    } else if (voteType == 0) {
        voteObj = {
            studentID,
            facultyID,
            upVote: 0,
            downVote: 1
        };
        sumSql = "UPDATE faculty set downVoteSum = downVoteSum + 1 where facultyID = ?";
    }

    db.query(sql, voteObj, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json(errorObj("Query failed! Get a new life!"));
        } else {
            db.query(sumSql, facultyID, (error, results, fields) => {
                if (error) {
                    console.log(error);
                } else {
                    return res.json(successObj("Inserted!"));
                }
            });
        }
    });
}