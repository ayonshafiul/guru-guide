import React from "react";

function FacultyDetails(props) {
  return (
    <div className="fg">
      <div className="fg-name">{props.faculty.facultyName}</div>
      <div className="fg-initials">{props.faculty.facultyInitials}</div>
      <div className="fg-overall">
        <span style={{ color: "#FDCC0D", fontSize: "2em" }}>&#9733;</span>{" "}
        {props.faculty.rating}{" "}
      </div>
      <div className="fg-grading">Grading: {props.faculty.grading} </div>
      <div className="fg-teaching">Teaching: {props.faculty.teaching} </div>
      <div className="fg-humanity">Humanity: {props.faculty.humanity} </div>
    </div>
  );
}

export default FacultyDetails;
