import axios from "axios";
import { useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import server from "../../serverDetails";
import GoogleLogin from "react-google-login";
import "./Login.css";

const Login = ({ isAuth, setIsAuth }) => {
  const history = useHistory();

  const responseGoogle = (googleUser) => {
    var id_token = googleUser.getAuthResponse().id_token;
    axios
      .get(server.url + "/api/googlelogin", {
        headers: {
          auth: id_token,
        },
        withCredentials: true,
      })
      .then((res) => {
        history.push("/faculty");
        setIsAuth(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleFailure = (error) => {
    console.log(error);
    if (error.error === "popup_closed_by_user") {
      alert("Please do not close the login window!");
    } else
      alert(
        "Something Bad happened. Please Make sure you are not in incognito mode!"
      );
  };
  return (
    <div className="login">
      {!isAuth ? (
        <GoogleLogin
          clientId={server.clientID}
          buttonText="Login with your BRAC GSUITE ID to continue..."
          prompt="consent"
          onSuccess={responseGoogle}
          onFailure={handleFailure}
        />
      ) : (
        <Redirect to="/faculty" />
      )}
    </div>
  );
};

export default Login;
