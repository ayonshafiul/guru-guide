const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = process.env.CLIENT_ID;
const db = require('./db');
const {createErrorObject, createSuccessObject} = require("./utils");

module.exports = function(req, res, next) {
    const token = req.body.token;
    const client = new OAuth2Client(CLIENT_ID);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        console.log(payload);
        let sql = "SELECT studentID from student where studentID = ?";
        db.query(sql, payload.sub, (error, results) => {
            if (error) {
                console.log(error);
                return res.json(createErrorObject("Error while querying for student!"));
            } else {
                if (results.length == 0) {
                    sql = "Insert into student set ?";
                    let studentObject = {
                        studentID: payload.sub,
                        name: "",
                        departmentID: 8,
                        email: payload.email,
                    };
                    db.query(sql, studentObject, (error, results) => {
                        if (error) {
                            console.log(error);
                            return res.json(createErrorObject("Error while creating a new student!"));
                        } else {
                            console.log("created new student!");
                        }
                    })
                }
            }
            
        })
    }
    verify().then(function() {
        console.log("Verified!");
        next();
    })
}