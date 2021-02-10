import React from "react";

function FacultyDetails(props) {
  return (
    <div>
      <h1>{props.faculty.facultyName}</h1>
      <div>{props.faculty.facultyInitials}</div>
      <div>Overall: {props.faculty.rating} </div>
      <div>Grading: {props.faculty.grading} </div>
      <div>Teaching: {props.faculty.teaching} </div>
      <div>Humanity: {props.faculty.humanity} </div>
    </div>
  );
}

export default FacultyDetails;
