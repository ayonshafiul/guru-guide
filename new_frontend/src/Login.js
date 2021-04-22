import axios from 'axios';
import { useEffect} from 'react';
import {useHistory, Redirect} from 'react-router-dom';
import server from './serverDetails'
import GoogleLogin from 'react-google-login';
import "./Login.css";

const Login = ({isAuth, setIsAuth}) => {
    const history = useHistory();

    
      const responseGoogle = (googleUser) => {
        var id_token = googleUser.getAuthResponse().id_token;
        axios.get("http://localhost:8080/api/googlelogin", {
          headers: {
            auth: id_token
          },
          withCredentials: true
        }).then((res) => {
          history.push("/faculty");
          setIsAuth(true);
        }).catch((err) =>{
          console.log(err)
        })
      }
      const handleFailure = (error) => {
        console.log(error);
      }
    return (
        <div className="login">
            {!isAuth ?
            <GoogleLogin
                clientId="187042784096-npj4khs2vuamrgch4odu4fmoboiv8f7v.apps.googleusercontent.com"
                buttonText="Login with your BRAC GSUITE ID to continue..."
                prompt="consent"
                onSuccess={responseGoogle}
                onFailure={handleFailure}
            /> : <Redirect to="/faculty"/> }
        </div>
    );
}
 
export default Login;