
const db = require("../db.js");



module.exports= function (req,res){
    const{departmentName}=req.body;
    
    db.query("SELECT departmentName FROM department WHERE departmentName=?" , [departmentName],(error,results)=>{
         if(error){
             console.log(error);
         } 
         if(results.length>0){
             return res.json({"success": "false", "message": "Department already exists"});
         }      
    
        var sql = "INSERT INTO department SET?";
        var value = {
            departmentName : req.body.departmentName
            
        };
        db.query(sql,value,function(error,results){
            if(error){
                console.log(error);
            }
            else{
                res.json({"success":"true", "message":"department added"});
            }
        });
    });

}
