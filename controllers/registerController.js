const express = require("express");

const db = require("../db.js");
const bcrypt = require('bcrypt');


module.exports = function abc(req, res) {
    const{email,password, passwordConfirm,departmentID}=req.body;
    db.query('select email from student where email=?' , [email], async (error,results) => {
       if(error){
           console.log(error);
       } 
       
       if(results.length>0){
           return res.json({"success": "false", "message": "Email already exists"});
        
       }
       else if(password !== passwordConfirm){
            return res.json({"success": "false", "message": "Passwords do not match"});
            
       }
       var hashedPassword = await bcrypt.hash(password,8);
       var sql = 'INSERT INTO student SET ?';
        var value = {
            email: req.body.email,
            password: hashedPassword,
            departmentID: req.body.departmentID

         };
        db.query(sql, value, function(error, results, fields) {
            if (error) {
                console.log(error);
            } 
            else {
                res.json({data:"registered successfully"});
             }


         });
    });
}