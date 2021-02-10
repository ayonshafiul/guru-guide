
const db = require("../db.js");
const mysql = require("mysql");


module.exports= function abc(req,res){
    const{departmentID,facultyName, facultyInitials}=req.body;
    var sql = "INSERT INTO faculty SET ?";
    var value = {
        departmentID:  req.body.departmentID,
        facultyName: req.body.facultyName,
        facultyInitials: req.body.facultyInitials,
        approved:0,
        upVoteSum: 0,
        downVoteSum: 0
    };
    db.query(sql,value,function(error,results){
        if(error){
            console.log(error);
        }
        else{
            res.json({"success": "true", "message": "Successfully Added faculty!"});
        }
    });
    

}
