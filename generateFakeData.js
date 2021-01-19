const faker= require("faker");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./db");
const bcrypt = require("bcrypt");


const numStudents = 100;
const numFaculties = 30;
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

// setTimeout(fakeStudents, timeBetweenEntry * 1000);
// setTimeout(fakeFaculties,timeBetweenEntry * 1000);
// setTimeout(fakeVotes, timeBetweenEntry * 1000);
// setTimeout(fakeRating, timeBetweenEntry * 1000);
// setTimeout(fakeComments,timeBetweenEntry *1000);
setTimeout(fakeCommentsRating,timeBetweenEntry *1000);



function fakeStudents(){
    const student = [];
    for(let i =0; i<numStudents; i++){
        student.push({
            email: faker.internet.email(),
            password:"1234",
            departmentID: faker.random.number({'min': 1,'max':7})
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

    for(let i = 1 ; i < numFaculties; i++ ){
        faculty.push(
            {
                facultyName:faker.name.firstName()+" "+ faker.name.lastName(),
                DepartmentID: faker.random.number({'min':1, 'max':7}),
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
function fakeVotes(){
    const vote = [];

    for(let i = 1 ; i < numVotes; i++ ){
        vote.push(
            {
                studentID: faker.random.number({'min':1 ,'max':numStudents}),
                facultyID: faker.random.number({'min':1 ,'max':numFaculties}),
                upVote : faker.random.number({'min':0,'max':1}),
                downVote: faker.random.number({'min':0,'max':1})
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

    for(let i = 1 ; i < numCommentRating; i++ ){
        commentrating.push(
            {
                commentId:faker.random.number({'min':1 ,'max':numComments}),
                studentID: faker.random.number({'min':1 ,'max':numStudents}),
                upVote : faker.random.number({'min':0,'max':1}),
                downVote: faker.random.number({'min':0,'max':1})
            }
            
        )

    }
    commentrating.forEach((commentrating)=>{
        var sql ='INSERT INTO commentrating SET ?';

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

