import React from "react";
import getDepartment from "../utils/departmentDetails";
function FacultyDetails(props) {
  return (
    <div className="fg">
      <div className="fg-name">{props.faculty.facultyName}</div>
      <div className="fg-initials">{props.faculty.facultyInitials}</div>
      <div className="fg-department">{getDepartment(props.faculty.departmentID)}</div>
      <div className="fg-overall">
        <span style={{ color: "#FDCC0D", fontSize: "2em" }}>&#9733; {((props.faculty.grading+ props.faculty.teaching + props.faculty.humanity)/3).toFixed(1)} </span>
       
      </div>
      <div className="fg-grading">Grading: {props.faculty.grading} </div>
      <div className="fg-teaching">Teaching: {props.faculty.teaching} </div>
      <div className="fg-humanity">Humanity: {props.faculty.humanity} </div>
    </div>
  );
}

export default FacultyDetails;
