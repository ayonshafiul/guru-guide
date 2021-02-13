import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import FacultyListItem from "./FacultyListItem";
import FacultyList from "./FacultyList";
import { Router, Link, Redirect, redirectTo } from "@reach/router";
import Faculty from "./Faculty";
import GoogleLogin from "react-google-login";
import { CookiesProvider, useCookies } from "react-cookie";

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
      });
  }

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
      <Redirect from="/faculty" to="/login" default noThrow />

      <GoogleLogin
        path="/login"
        clientId="187042784096-npj4khs2vuamrgch4odu4fmoboiv8f7v.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={logInUser}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
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
