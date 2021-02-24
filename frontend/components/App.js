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
import { ToastProvider, useToasts } from 'react-toast-notifications';


function responseGoogle() {}

function App() {
  const [faculties, setFaculties] = useState([]);
  const [cookies, setCookie] = useCookies(["jwt"]);
  const [faculty, setFaculty] = useState({});
  const { addToast } = useToasts();

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
      if (data.success)
        addToast("Faculty added in the database!", {appearance: 'success'});
      
    });
  }
  else{
    addToast("Please fill up all required fields!", {appearance: 'error'});
  }
  }
  function sortFaculty(type) {
    if(type=== "ratingdesc") {
      const tempFaculties = [...faculties];
      
      tempFaculties.sort(function(item1, item2){
        const item1total = item1.grading + item1.humanity + item1.teaching;
        const item2total = item2.grading + item2.humanity + item2.teaching;
        if(item1total < item2total) {
          return 1;
        } else if (item1total > item2total) {
          return -1;
        } else { 
          if(item1.facultyName < item2.facultyName) {
            return -1;
          } else if (item1.facultyName > item2.facultyName) {
            return 1;
          }
        }
      }); 
      setFaculties(tempFaculties);
    } else if(type=== "ratingasc") {
      const tempFaculties = [...faculties];
      
      tempFaculties.sort(function(item1, item2){
        const item1total = item1.grading + item1.humanity + item1.teaching;
        const item2total = item2.grading + item2.humanity + item2.teaching;
        if(item1total < item2total) {
          return -1;
        } else if (item1total > item2total) {
          return 1;
        } else { 
          if(item1.facultyName < item2.facultyName) {
            return -1;
          } else if (item1.facultyName > item2.facultyName) {
            return 1;
          }
        }
      }); 
      setFaculties(tempFaculties);

    } else if (type==="nameasc") {
      const tempFaculties = [...faculties];
      
      tempFaculties.sort(function(item1, item2){
        if(item1.facultyName < item2.facultyName) {
          return -1;
        } else if (item1.facultyName > item2.facultyName) {
          return 1;
        } else { 
          return 0;
        }
      }); 
      setFaculties(tempFaculties);

    } else if (type==="namedesc") {
      const tempFaculties = [...faculties];
      
      tempFaculties.sort(function(item1, item2){
        if(item1.facultyName < item2.facultyName) {
          return 1;
        } else if (item1.facultyName > item2.facultyName) {
          return -1;
        } else { 
          return 0;
        }
      }); 
      setFaculties(tempFaculties);

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
      <FacultyList path="/faculty" faculties={faculties} sortFaculty={sortFaculty}/>
      <Faculty path="/faculty/:id" faculties={faculties} />
      <FacultyVotingList path="/faculty/vote" faculties={faculties} />
      <AddFaculty path="/faculty/add" handleChange={handleChange} addFaculty={addFaculty}/>
    </Router>
  );
}

ReactDOM.render(
  <ToastProvider
    autoDismiss
    autoDismissTimeout={4000}
    placement="bottom-right"
  >
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </ToastProvider>,
  document.getElementById("root")
);
