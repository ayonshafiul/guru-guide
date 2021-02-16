const db = require("../db");
const validator = require("validator");
const {createErrorObject, createSuccessObject} = require("../utils");

module.exports=function(req, res){

// **************************************/
    // validation
   
    let voteType;
    let studentID =req.user.studentID;
    let commentID = 1; //TODO: authenticate student and use that authenticated studentID
    if (validator.isNumeric(req.params.commentID)) {
        commentID = parseInt(req.params.commentID);
    } else {
        return res.json(createErrorObject("commentID not valid!"));
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

    let sql = "SELECT * from commentrating where commentID = ? AND studentID = ?";
    db.query(sql,[commentID, studentID],function(error,results){
         if(error){
             console.log(error);
             res.json(createErrorObject("comment voting failed"));
         }
         else{
            if(results.length==0){
                let commentratingObj;
                let secondsql;
                sql="INSERT into commentrating set ?";

                if(voteType==1){
                     commentratingObj ={commentID,studentID, upVote:1, downVote:0 };
                     secondsql = "Update comment set upVoteSum = upVoteSum + 1 where commentID = ? ";
                }
                else{
                    commentratingObj ={commentID,studentID, upVote:0, downVote:1 };
                    secondsql = "Update comment set downVoteSum = downVoteSum + 1 where commentID = ? ";
                }
                db.query(sql,commentratingObj,function(error,results){
                    if(error){
                        console.log(error);
                        res.json(createErrorObject("vote not inserted"));
                    }
                    else{
                        console.log(results);
                        db.query(secondsql,[commentID],function(error,results){
                            if(error){
                                console.log(error);
                                res.json(createErrorObject("vote not inserted"));
                                
                            }
                            else{
                                console.log(results);
                        res.json(createSuccessObject("vote inserted successfully"));
                            }
                        });

                    }
                });
                 
            }
            else{
                let firstSql;
                let secondSql;
                if(results[0].upVote==1 && voteType==0){
                    //when vote is changed from upVote to downVote
                    
                        firstSql ="UPDATE commentrating set upVote=0 , downVote = 1 where commentID =? and studentID =?";
                        secondSql = "UPDATE comment set upVoteSum = upVoteSum - 1 , downVoteSum = downVoteSum + 1 where commentID =?";
                    
                }

                else if(results[0].upVote==0 && voteType==1){
                    //when vote is changed from downVote to upVote
                        firstSql ="UPDATE commentrating set upVote=1 , downVote = 0 where commentID =? and studentID =?";
                        secondSql = "UPDATE comment set upVoteSum = upVoteSum + 1 , downVoteSum = downVoteSum - 1 where commentID =?";
                    
                }
                else{
                    return res.json(createErrorObject("no need to update"));
                }
                
                db.query(firstSql, [commentID,studentID],function(error,results){
                    if(error){
                    console.log(error);
                    res.json(createErrorObject("vote not updated"));
                    }
                    else{
                        //run second sql here
                        db.query(secondSql,commentID, function(error,results){
                            if(error){
                                console.log(error);
                                res.json(createErrorObject("voteSum not updated"));
                            }
                            else{
                                console.log(results);
                                res.json(createSuccessObject("voteSum is updated successfully"));
                            };
                        })
                    }

                });
            }
         }
    })
}