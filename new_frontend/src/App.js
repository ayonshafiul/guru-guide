import GoogleLogin from 'react-google-login';
import axios from 'axios';
import { useEffect, useState } from 'react';
import server from './serverDetails'




function App() {

  const [isAuth, setIsAuth] = useState('false');

  useEffect(() => {
    console.log(server);
    axios.get(server.url + "/api/isauth", {
      withCredentials: true
    }).then((res) => {
      console.log(res.data)
      if(res.data.success) {
        console.log("suceess");
        setIsAuth(true)
        
      } else {
        console.log("not success");
        setIsAuth(false)
      }
    })
  }, [])

  const responseGoogle = (googleUser) => {
    var id_token = googleUser.getAuthResponse().id_token;
    axios.get("http://localhost:8080/api/googlelogin", {
      headers: {
        auth: id_token
      },
      withCredentials: true
    }).then((res) => {
      console.log(res);
      setIsAuth(true);
    }).catch((err) =>{
      console.log(err)
    })
  }
  const handleFailure = (error) => {
    console.log(error);
  }
  return (
    <div className="App">
      {!isAuth && <GoogleLogin
        clientId="187042784096-npj4khs2vuamrgch4odu4fmoboiv8f7v.apps.googleusercontent.com"
        buttonText="Login with your BRAC GSUITE ID to continue..."
        prompt="consent"
        onSuccess={responseGoogle}
        onFailure={handleFailure}
      />}

    </div>
  );
}

export default App;
