import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import FacultyListItem from "./FacultyListItem";

function App() {
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/faculty")
      .then((data) => {
        return data.json();
      })
      .then((results) => {
        setFaculties(results.data);
      });
  }, []);
  return (
    <div>
      <h1>Faculties</h1>
      {faculties.map((faculty) => {
        const rating =
          (faculty.teaching + faculty.grading + faculty.humanity) / 3;
        return (
          <FacultyListItem
            key={faculty.facultyID}
            name={faculty.facultyName}
            initials={faculty.facultyInitials}
            rating={rating}
          />
        );
      })}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
