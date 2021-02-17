import React from "react";
import GoogleLogin from "react-google-login";
import { Link, Redirect } from "@reach/router";

function GoogleLoginButton(props) {
  return typeof props.cookies.jwt == "undefined" ? (
    <GoogleLogin
      clientId="187042784096-npj4khs2vuamrgch4odu4fmoboiv8f7v.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={props.logInUser}
      onFailure={props.responseGoogle}
      cookiePolicy={"single_host_origin"}
    />
  ) : (
    <Redirect to="/faculty" noThrow>You are already logged in!</Redirect>
  );
}

export default GoogleLoginButton;
