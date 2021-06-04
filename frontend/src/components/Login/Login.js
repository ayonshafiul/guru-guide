import axios from "axios";
import { useHistory, Redirect } from "react-router-dom";
import server from "../../serverDetails";
import GoogleLogin from "react-google-login";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import "./Login.css";

const Login = () => {
  const history = useHistory();
  const { isAuth, setIsAuth } = useContext(AuthContext);
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
        if (typeof res.data !== "undefined") {
          if (res.data.success) {
            history.go(-1);
            setIsAuth(true);
          } else {
            if (res.data.message === "notbracu") {
              alert("Please use your g.bracu.ac.bd email account!");
            } else {
              alert("An error occured while logging you in. :(");
            }
          }
        }
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
        <Redirect
          to={
            typeof history.location.state !== "undefined"
              ? history.location.state.from.pathname
              : "/faculty"
          }
        />
      )}
    </div>
  );
};

export default Login;
