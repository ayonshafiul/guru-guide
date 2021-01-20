    const db = require("../db");

    module.exports = function sum() {
        
            let upVoteSum;
            let downVoteSum;
            let sql;
            let values;
            let endFaculty;
            
            
            sql ="SELECT max(facultyID) as a FROM faculty";
            db.query(sql,(error,results,feilds)=>{
                if(error){
                    console.log(error);
                }
                else{
                    endFaculty= results[0].a
                   console.log(endFaculty);
                }
            });
        
           
            // ending condition needs to be changed
            
            for(let facultyID=1;facultyID<35;facultyID++){

                sql = "SELECT  SUM(upVote) as upVoteSum, SUM(downVote) as downVoteSum FROM vote WHERE facultyID=? ";
                values =[facultyID];
                db.query(sql,values,(error,results,feilds)=>{
                    if(error){
                        console.log(error);
                    }
                    else{
                    upVoteSum = results[0].upVoteSum;
                    downVoteSum = results[0].downVoteSum;

                    if(upVoteSum>downVoteSum){
                        sql ="UPDATE faculty SET approved=?, upVoteSum =?, downVoteSum=? WHERE facultyID=? ";
                        values=[1,upVoteSum,downVoteSum,facultyID]; 
                    }
                    else{
                    sql ="UPDATE faculty SET upVoteSum =?, downVoteSum=? WHERE facultyID=? ";
                    values=[upVoteSum,downVoteSum,facultyID];
                    }

                    db.query(sql,values,(error,results,feilds)=>{
                        if(error){
                            console.log(error);
                        }
                        else{
                            console.log(results);
                        }
                    });
                    }
                });
               
            }
            console.log("success");
        }
            
        