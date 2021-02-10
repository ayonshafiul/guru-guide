import React from "react";

function FacultyListItem(props) {
  return (
    <div className="faculty">
      <div className="facultyName">{props.name}</div>
      <div className="facultyInitials">{props.initials}</div>
      <div className="facultyRating">
        <span style={{ color: "#FDCC0D" }}>&#9733;</span> {props.rating}
      </div>
    </div>
  );
}

export default FacultyListItem;
