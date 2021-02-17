import React from "react";
import FacultyVotingListItem from "./FacultyVotingListItem";
import { Link } from "@reach/router";


function FacultyVotingList(props) {
  console.log(props);

  function like(facultyID){
    const url ="http://localhost:8080/vote/"+facultyID+"/1"
    fetch(url, {
      method: "POST",
      credentials: "include",
      
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if(data.success==true ){
          console.log("voting done");
        }
        console.log(data);
      });
  }
  function dislike(facultyID){
    const url ="http://localhost:8080/vote/"+facultyID+"/0"
    fetch(url, {
      method: "POST",
      credentials: "include",
      
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if(data.success==true ){
          console.log("voting done");
        }
        console.log(data);
      });
  }
  return (
    <React.Fragment>
      <h1 className="facultyListHeader">Faculty Verification</h1>
      {props.faculties.map((faculty) => {
        const rating = (
          (faculty.teaching + faculty.grading + faculty.humanity) /
          3
        ).toFixed(1);
        const linkPath = "/faculty/" + faculty.facultyID;
        return (
          
            <FacultyVotingListItem
              name={faculty.facultyName}
              initials={faculty.facultyInitials}
              facultyID={faculty.facultyID}
              rating={rating}
              key={faculty.facultyID}
              like={like}
              dislike={dislike}
            />
         
        );
      })}
    </React.Fragment>
  );
}

export default FacultyVotingList;
