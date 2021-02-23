import React from "react";
import FacultyListItem from "./FacultyListItem";
import { Link } from "@reach/router";
import SortComponent from "./SortComponent";
function FacultyList(props) {
  console.log(props);
  function handleChange(data) {
    props.sortFaculty(data.value);
  }
  return (
    <React.Fragment>
      <h1 className="facultyListHeader">Faculties</h1>
      <SortComponent handleChange={handleChange}/>
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
