const bcrypt = require('bcrypt');



    const{email,password, passwordConfirm}=req.body;
    db.query('select email from student where email=?' , [email], async (error,results) => {
       if(error){
           console.log(error);
       } 
       
       if(results.length>0){
           return res.json("register",{message:"Email already exists"});
        
       }
       else if(password !== passwordConfirm){
            return res.json("register",{message:"passwords do not match"});
            
       }
       var hashedPassword = await bcrypt.hash(password,8);
       var sql = 'INSERT INTO student SET ?';
        var value = {
            email: req.body.email,
            password: hashedPassword,

         };
        db.query(sql, value, function(error, results, fields) {
            if (error) {
                console.log(error);
            } 
            else {
                res.json({data: results});
             }


         });
    });