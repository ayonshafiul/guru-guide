import React from "react";
import FacultyDetails from "./FacultyDetails";

function Faculty(props) {
  const facultyArray = props.faculties.filter((faculty) => {
    return faculty.facultyID == props.id;
  });
  console.log(facultyArray);
  return facultyArray.length > 0 ? (
    <FacultyDetails faculty={facultyArray[0]} />
  ) : (
    <FacultyDetails faculty={{ facultyName: "loading.." }} />
  );
}

export default Faculty;
