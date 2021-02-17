import React from "react";

function FacultyVotingListItem(props) {
  return (
    <div className="faculty">
      <div className="facultyName">{props.name}</div>
      <div className="facultyInitials">{props.initials}</div>
      <div className="facultyRating">
      <button className="f-vote" onClick={() => {props.like(props.facultyID)}}>&#10003;</button>
        <button className="f-vote" onClick={() => {props.dislike(props.facultyID)}}>&#10060;</button>
      </div>
      
      
    </div>
  );
}

export default FacultyVotingListItem;
