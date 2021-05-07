
const db = require("../db.js");
const mysql = require("mysql");
const { createErrorObject, createSuccessObjectWithData } = require("../utils");


module.exports= function abc(req,res){
    const{departmentID,facultyName, facultyInitials}=req.body;
    var sql = "INSERT INTO faculty SET ?";
    var value = {
        departmentID:  Number(req.body.departmentID),
        facultyName: req.body.facultyName,
        facultyInitials: req.body.facultyInitials,
    };
    db.query(sql,value,function(error,results){
        if(error){
            console.log(error);
        }
        else{
            res.json(createSuccessObjectWithData("Faculty added!"));
        }
    });
    

}
