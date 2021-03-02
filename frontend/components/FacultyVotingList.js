import React from "react";
import FacultyVotingListItem from "./FacultyVotingListItem";
import { Link } from "@reach/router";
import {useToasts} from "react-toast-notifications";
import serverDetails from "../utils/serverDetails";


function FacultyVotingList(props) {
  const {addToast} = useToasts();

  function like(facultyID){
    const url = serverDetails.server + "api/vote/"+facultyID+"/1"
    fetch(url, {
      method: "POST",
      credentials: "include",
      
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if(data.success==true ){
          addToast('Thank you for helping us verify the authenticity of the faculty!', {appearance: 'success'});
        }
        console.log(data);
      });
  }
  function dislike(facultyID){
    const url = serverDetails.server + "api/vote/"+facultyID+"/0"
    fetch(url, {
      method: "POST",
      credentials: "include",
      
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if(data.success==true ){
          addToast('Thank you for helping us verify the authenticity of the faculty!', {appearance: 'success'});
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
