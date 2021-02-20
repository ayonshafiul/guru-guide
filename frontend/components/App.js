import React, { useState, useEffect} from "react";
import ReactDOM from "react-dom";
import FacultyListItem from "./FacultyListItem";
import FacultyList from "./FacultyList";
import { Router, Link, Redirect, redirectTo, navigate } from "@reach/router";
import Faculty from "./Faculty";
import GoogleLoginButton from "./GoogleLoginButton";
import { CookiesProvider, useCookies } from "react-cookie";
import GoogleLogin from "react-google-login";
import FacultyVotingList from "./FacultyVotingList";
import AddFaculty from "./AddFaculty";
import {getDepartmentID} from "../utils/departmentDetails";


function responseGoogle() {}

function App() {
  const [faculties, setFaculties] = useState([]);
  
  const [cookies, setCookie] = useCookies(["jwt"]);
  const [faculty, setFaculty] = useState({});

  function logInUser(googleUser) {
    const token = googleUser.getAuthResponse().id_token;
    fetch("http://localhost:8080/googlelogin", {
      method: "get",
      headers: {
        auth: token,
      },
    })
      .then(function (data) {
        return data.json();
      })
      .then(function (data) {
        setCookie("jwt", data.token, {
          path: "/",
        });
        navigate("/faculty");
      });
  }

  useEffect(() => {
    fetch("http://localhost:8080/faculty", {
      method: "GET",
      credentials: "include",
    })
      .then((data) => {
        return data.json();
      })
      .then((results) => {
        console.log(results);
        setFaculties(results.data);
      });
  }, []);

  function handleChange(event){
    
    let name, value;
    if(typeof (event.target) =="undefined"){
      name="departmentID"
      value=getDepartmentID(event.value)
    }
    else{
      name=event.target.name;
      value = event.target.value;
    }
    setFaculty((currentState) => {
      return {...currentState,[name]:value}
    });
  }

  function addFaculty(event){
  event.preventDefault();
  if(faculty["departmentID"]&&faculty["facultyName"]&&faculty["facultyInitials"]){
    console.log(faculty);
  
    let url = "http://localhost:8080/faculty" ;

    fetch(url,{
      method: "POST",
      credentials: "include",
      body:"departmentID="+faculty["departmentID"]+ "&facultyName="+faculty["facultyName"] + "&facultyInitials="+ faculty["facultyInitials"],
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
      
    })
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      if(data.success==true ){
        console.log("Faculty added succesfully");
      }
    });
  }
  else{
    console.log("Please provide all the DETAILS");
  }
  }

  return (
    <Router>
      <GoogleLoginButton
        path="/"
        cookies={cookies}
        logInUser={logInUser}
        responseGoogle={responseGoogle}
      />
      <FacultyList path="/faculty" faculties={faculties} />
      <Faculty path="/faculty/:id" faculties={faculties} />
      <FacultyVotingList path="/faculty/vote" faculties={faculties} />
      <AddFaculty path="/faculty/add" handleChange={handleChange} addFaculty={addFaculty}/>
    </Router>
  );
}

ReactDOM.render(
  <CookiesProvider>
    <App />
  </CookiesProvider>,
  document.getElementById("root")
);
