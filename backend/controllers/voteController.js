const db = require("../db");
const validator = require("validator");
const {createErrorObject, createSuccessObject} = require("../utils");



module.exports = (req, res) => {
    

    // **************************************/
    // validation
    let facultyID;
    let voteType;
    let studentID = req.user.studentID;
    if (validator.isNumeric(req.params.facultyID)) {
        facultyID = parseInt(req.params.facultyID);
    } else {
        return res.json(createErrorObject("facultyID not valid!"));
    }
    if (validator.isNumeric(req.params.voteType)) {
        voteType = parseInt(req.params.voteType);
        if (voteType != 1 && voteType != 0) {
            return res.json(createErrorObject("Vote not valid!"));
        }
    } else {
        return res.json(createErrorObject("Vote not valid!"));
    }
    // 1 means upvote
    // 0 means downvote

    //************************************************** */


    let selectSql = "SELECT upVote, downVote from vote where studentID = ? and facultyID = ?";

    db.query(selectSql, [studentID, facultyID], (error, results, fields) => {
        if (error) {
            return res.json(createErrorObject("No results found!"));
        } else {
            if (results.length == 0) {
                // vote doesn't yet exist 
                // insert new data
                insertData(req, res, facultyID, voteType, studentID);
            } else if (results[0].upVote == 1 && results[0].downVote == 0) { // alredy upvoted  
                if ( voteType == 0) { 
                    // only update if vote is changed to downvote
                    // downvoting..
                    downVote(req, res, facultyID, voteType, studentID);
                } else {
                    return res.json(createSuccessObject("No need to upvote as upvote exists!"));
                }
            } else if ( results[0].upVote == 0 && results[0].downVote == 1) { // already downvoted
                if (voteType == 1) { 
                    // only update if vote is changed to upvote
                    // upvoting...
                    upVote(req, res, facultyID, voteType, studentID);
                } else {
                    return res.json(createSuccessObject("No need to downvote as downvote exists!"));
                }
            }
        }
    })  
}
function upVote(req, res, facultyID, voteType, studentID) {
    let sql = "UPDATE vote SET upVote = ?, downVote = ? where studentID = ? and facultyID = ?";
    let values = [1, 0, studentID, facultyID];
    db.query(sql, values, (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.json(createErrorObject("Upvoting failed!"));
        } else { 
            // updating successful
            // update the total sum
            let sql = "UPDATE facultyverify set upVoteSum = upVoteSum + 1, downVoteSum = downVoteSum - 1 where facultyID = ?";
            db.query(sql, facultyID, (error, results, fields) => {
                if(error) {
                    console.log(error);
                    return res.json(createErrorObject("Updating the sum after upvoting failed!"));
                } else {
                    // sum updated successfully
                    return res.json(createSuccessObject("Upvote updated!"));
                }
            });
        }
    });
}

function downVote(req, res, facultyID, voteType, studentID) {
    let sql = "UPDATE vote SET upVote = ?, downVote = ? where studentID = ? and facultyID = ?";
    let values = [0, 1, studentID, facultyID];
    db.query(sql, values, (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.json(createErrorObject("Downvoting failed!"));
        } else { // updating successful
            // update the total sum
            let sql = "UPDATE facultyverify set upVoteSum = upVoteSum - 1, downVoteSum = downVoteSum + 1 where facultyID = ?";
            db.query(sql, facultyID, (error, results, fields) => {
                if(error) {
                    console.log(error);
                    return res.json(createErrorObject("Updating the sum after downvoting failed!"));
                } else {
                    // sum updated successfully
                    return res.json(createSuccessObject("Downvote updated!"));
                }
            });
        }
    });
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
        sumSql = "UPDATE facultyverify set upVoteSum = upVoteSum + 1 where facultyID = ?";

    } else if (voteType == 0) {
        voteObj = {
            studentID,
            facultyID,
            upVote: 0,
            downVote: 1
        };
        sumSql = "UPDATE facultyverify set downVoteSum = downVoteSum + 1 where facultyID = ?";
    }

    db.query(sql, voteObj, (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.json(createErrorObject("Inserting new vote failed!"));
        } else {
            db.query(sumSql, facultyID, (error, results, fields) => {
                if (error) {
                    console.log(error);
                } else {
                    return res.json(createSuccessObject("Inserted new vote succesfully!"));
                }
            });
        }
    });
}