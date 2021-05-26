import { useState, useEffect, createContext } from "react";
import server from "../serverDetails";
import axios from "axios";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    axios
      .get(server.url + "/api/isauth", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      });
  }, []);
  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
