import React from "react";
import FacultyListItem from "./FacultyListItem";
import { Link } from "@reach/router";

function FacultyList(props) {
  console.log(props);
  return (
    <React.Fragment>
      <h1 className="facultyListHeader">Faculties</h1>
      {props.faculties.map((faculty) => {
        const rating = (
          (faculty.teaching + faculty.grading + faculty.humanity) /
          3
        ).toFixed(1);
        const linkPath = "/faculty/" + faculty.facultyID;
        return (
          <Link
            key={faculty.facultyID}
            to={linkPath}
            className="facultyLink"
            style={{ textDecoration: "none" }}
          >
            <FacultyListItem
              name={faculty.facultyName}
              initials={faculty.facultyInitials}
              rating={rating}
            />
          </Link>
        );
      })}
    </React.Fragment>
  );
}

export default FacultyList;
