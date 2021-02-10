import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import FacultyListItem from "./FacultyListItem";
import FacultyList from "./FacultyList";
import { Router, Link } from "@reach/router";
import Faculty from "./Faculty";

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
    <Router>
      <FacultyList path="/faculty" faculties={faculties} />
      <Faculty path="/faculty/:id" faculties={faculties} />
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
