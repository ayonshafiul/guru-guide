const jwt = require("jsonwebtoken");

const {createSuccessObjectWithData,createErrorObject}= require("./utils");

module.exports = function(req, res , next){
    

    console.log(req.cookies);
    const token= req.cookies["jwt"];
    
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if(typeof decode.id != "undefined"){
        req.user={stdentID:decode.id};
        next();
    }else{
        return res.json(createErrorObject("token invalid"));
    }

}
