import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import FacultyListItem from "./FacultyListItem";
import FacultyList from "./FacultyList";
import { Router, Link, Redirect, redirectTo, navigate } from "@reach/router";
import Faculty from "./Faculty";
import GoogleLoginButton from "./GoogleLoginButton";
import { CookiesProvider, useCookies } from "react-cookie";
import GoogleLogin from "react-google-login";


function responseGoogle() {}

function App() {
  const [faculties, setFaculties] = useState([]);
  
  const [cookies, setCookie] = useCookies(["jwt"]);

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
        navigate("/");
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

  return (
    <Router>
      <GoogleLoginButton
        path="/login"
        cookies={cookies}
        logInUser={logInUser}
        responseGoogle={responseGoogle}
      />
      <FacultyList path="/faculty" faculties={faculties} />
      <Faculty path="/faculty/:id" faculties={faculties} />
    </Router>
  );
}

ReactDOM.render(
  <CookiesProvider>
    <App />
  </CookiesProvider>,
  document.getElementById("root")
);
