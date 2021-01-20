const faker= require("faker");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./db");
const bcrypt = require("bcrypt");


const numStudents = 100;
const numFaculties = 30;
const departmentArray = ['CSE', 'EEE', 'ESS', 'ARC', 'MNS', 'BBS', 'PHR'];
const numVotes = 100;
const numRates = 100;
const numComments = 100;
const numCommentRating = 100;
const timeBetweenEntry = 5;

db.connect((err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Mysql connected...");
    }
});
departmentArray.forEach((dept) => {
    let sql = "INSERT INTO department SET ?";
    let departmentObj = {
        departmentName: dept
    };
    db.query(sql, departmentObj, (error, results, fields) => {
        if (error) {
            console.log(error);
        } else {
            console.log(dept + " added!");
        }
    });
})

setTimeout(fakeStudents, timeBetweenEntry * 1000);
setTimeout(fakeFaculties,timeBetweenEntry * 1000 * 3);
setTimeout(fakeVotes, timeBetweenEntry * 1000 * 4)
setTimeout(fakeRating, timeBetweenEntry * 1000 * 5);
setTimeout(fakeComments,timeBetweenEntry *1000 * 6);
setTimeout(fakeCommentsRating,timeBetweenEntry * 1000 * 7);



function fakeStudents(){
    const student = [];
    for(let i =0; i<numStudents; i++){
        student.push({
            email: faker.internet.email(),
            password:"1234",
            departmentID: faker.random.number({'min': 1,'max': departmentArray.length})
        })
    }


student.forEach((student) =>{
    db.query("SELECT email FROM student WHERE email=?",[student.email],async (error,results) => {
        if(error){
            console.log(error);
        }
        var hashedPassword = await bcrypt.hash(student.password,8);
        student.password = hashedPassword;

        var sql = "INSERT INTO student SET ?";

        db.query(sql,student,function(error, results, fields){
            if(error){
                console.log(error);
            }
            
        });
    });
    console.log("Fake students created");
})

}
function fakeFaculties(){
    const faculty = [];

    for(let i = 1 ; i <= numFaculties; i++ ){
        faculty.push(
            {
                facultyName:faker.name.firstName()+" "+ faker.name.lastName(),
                DepartmentID: faker.random.number({'min':1, 'max': departmentArray.length}),
                facultyInitials: faker.name.firstName().substring(0,2).toUpperCase()+faker.name.lastName().charAt(0),
                Approved: 0
            }
        )

    }
    faculty.forEach((faculty)=>{
        var sql ='INSERT INTO faculty SET ?';

        db.query (sql,faculty,function(error,results,fields){
            if(error){
                console.log(error);
            }
            else{
                // console.log("success");
            }
        });
    });
    console.log("fake faculties created");
}
var decidedUpVote = 0;
var decidedDownVote = 0;
function decideUpOrDown() {
    let random = Math.random(); 
    if (random < 0.5) {
        decidedUpVote = 1;
        decidedDownVote = 0;
    } else {
        decidedUpVote = 0;
        decidedDownVote = 1;
    }
}
function fakeVotes(){
    const vote = [];

    for(let i = 1 ; i < numVotes; i++ ){
        decideUpOrDown();
        vote.push(
            {
                studentID: faker.random.number({'min':1 ,'max':numStudents}),
                facultyID: faker.random.number({'min':1 ,'max':numFaculties}),
                upVote : decidedUpVote,
                downVote: decidedDownVote
            }
        )

    }
    vote.forEach((vote)=>{
        var sql ='INSERT INTO vote SET ?';

        db.query (sql,vote,function(error,results,fields){
            if(error){
                console.log(error);
            }
            else{
                // console.log("success");
            }
        });
    });
    console.log("fake votes created");
}
function fakeRating(){
    const rating = [];

    for(let i = 1 ; i < numRates; i++ ){
        rating.push(
            {
                studentID: faker.random.number({'min':1 ,'max':numStudents}),
                facultyID: faker.random.number({'min':1 ,'max':numFaculties}),
                teaching : faker.random.number({'min':0,'max':10}),
                grading: faker.random.number({'min':1,'max':10}),
                humanity: faker.random.number({'min':1,'max':10})
            }
        )

    }
    rating.forEach((rating)=>{
        var sql ='INSERT INTO rating SET ?';

        db.query (sql,rating,function(error,results,fields){
            if(error){
                console.log(error);
            }
            else{
                // console.log("success");
            }
        });
    });
    console.log("fake rating created");
}
function fakeComments(){
    const comment = [];

    for(let i = 1 ; i < numComments; i++ ){
        comment.push(
            {
                studentID: faker.random.number({'min':1 ,'max':numStudents}),
                facultyID: faker.random.number({'min':1 ,'max':numFaculties}),
                comment:faker.lorem.paragraph()
            }
        )

    }
    comment.forEach((comment)=>{
        var sql ='INSERT INTO comment SET ?';

        db.query (sql,comment,function(error,results,fields){
            if(error){
                console.log(error);
            }
            else{
                // console.log("success");
            }
        });
    });
    console.log("fake comments created");
}
function fakeCommentsRating(){
    const commentrating = [];

    for(let i = 1 ; i <= numCommentRating; i++ ){
        decideUpOrDown();
        commentrating.push(
            {
                commentId:faker.random.number({'min':1 ,'max':numComments}),
                studentID: faker.random.number({'min':1 ,'max':numStudents}),
                upVote : decidedUpVote,
                downVote: decidedDownVote
            }
            
        )

    }
    commentrating.forEach((commentrating)=>{
        var sql ='INSERT INTO commentRating SET ?';

        db.query (sql,commentrating,function(error,results,fields){
            if(error){
                console.log(error);
            }
            else{
                // console.log("success");
            }
        });
    });
    console.log("fake commentratings created");
}

