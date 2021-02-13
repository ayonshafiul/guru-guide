import React from "react";

function Login() {
  return (
    <div>
      <div className="g-signin2" data-onsuccess="onSignIn"></div>
      <a href="#" onclick="signOut();">
        Sign out
      </a>
    </div>
  );
}

export default Login;
