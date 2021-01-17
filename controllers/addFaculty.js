
const db = require("../db.js");
const mysql = require("mysql");


module.exports= function abc(req,res){
    const{departmentID,facultyName, facultyInitials}=req.body;
    
    db.query("SELECT facultyInitials FROM faculty WHERE facultyInitials=?" , [facultyInitials],(error,results)=>{
         if(error){
             console.log(error);
         } 
         else if(results.length>0){
             return res.json({"success": "false", "message": "faculty already exists"});
         }      
    
        var sql = "INSERT INTO faculty SET ?";
        var value = {
            departmentID:  req.body.departmentID,
            facultyName: req.body.facultyName,
            facultyInitials: req.body.facultyInitials,
            approved:0
        };
        db.query(sql,value,function(error,results){
            if(error){
                console.log(error);
            }
            else{
                res.json({"success": "true", "message": "Successfully Added faculty!"});
            }
        });
    });

}
