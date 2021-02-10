const db = require("../db.js");

function approve(){
    let sql= "SELECT * FROM faculty";
     db.query(sql,[],function(error,results){
         if(error){
             console.log(error);
         }
         else{
             for(var i = 0 ; i<results.length ;i++){
                 if(results[i].approve==0){
                if( results[i].upVoteSum/(results[i].upVoteSum +results[i].downVoteSum)>0.7){
                    let sql = "UPDATE faculty SET approved =1 where facultyID =?";
                    db.query(sql,results[i].facultyID,function(error,results){
                        if(error){
                            console.log(error);
                        }
                        else{
                            console.log(results);
                        }
                    });
                }
             }else{
                 if( results[i].upVoteSum/(results[i].upVoteSum +results[i].downVoteSum)<=0.7){
                     let sql = "UPDATE faculty SET approved =0 where facultyID =?";
                     db.query(sql,results[i].facultyID,function(error,results){
                         if(error){
                             console.log(error);
                         }
                         else{
                             console.log(results);
                         }
                     });
                 }
             }
                
             } 
         }
     })
 }
 
 function removeUnapproved(){
  let sql ="DELETE FROM faculty where approved = 0";
  db.query(sql,function(error,results){
     if(error){
         console.log(error);
     }
     else{
         console.log("success");
     }
  });
 }
 function removeDuplicate(){
     let sql = "DELETE f1 FROM faculty f1 INNER JOIN faculty f2 WHERE f1.upVoteSum < f2.upVoteSum AND f1.facultyInitials = f2.facultyInitials AND f1.departmentID = f2.departmentID";
     db.query(sql,function(error,results){
         if(error){
             console.log(error);
         }
         else{
             console.log("success");
         }
     });
 }
 module.exports.approve = approve;
 module.exports.removeUnapproved = removeUnapproved;
 module.exports.removeDuplicate = removeDuplicate;