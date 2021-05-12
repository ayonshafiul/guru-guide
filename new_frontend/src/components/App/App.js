import Navbar from "../Navbar/Navbar";
import './App.css';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import Verify from "../Verify/Verify";
import Contribute from "../Contribute/Contribute";
import Help from "../Help/Help";
import Contact from "../Contact/Contact";
import {useState, useEffect} from 'react';
import server from '../../serverDetails';
import axios from 'axios';
import FacultyList from "../FacultyList/FacultyList";
import Login from '../Login/Login';
import Page404 from "../Page404/Page404";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import { QueryClient, QueryClientProvider } from 'react-query'

import { ReactQueryDevtools } from 'react-query/devtools'
import FacultyDetails from "../FacultyDetails/FacultyDetails";



function App() {

  const [isAuth, setIsAuth] = useState('false');

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 120000,
        cacheTime: 300000,
        refetchOnMount: false
      }
    },
  });

  useEffect(() => {
    axios.get(server.url + "/api/isauth", {
      withCredentials: true
    }).then((res) => {
      if(res.data.success) {
        setIsAuth(true)
      } else {
        setIsAuth(false)
      }
    })
  }, [])
  
  return (
    <QueryClientProvider client={queryClient}>
    <Router>
        <Navbar></Navbar>
        <div className="App">
          <Switch>
              <Route exact path="/contribute">{isAuth ? <Contribute/> : <Redirect to="/login"/> }</Route>
              <Route exact path="/verify">{isAuth ? <Verify/> : <Redirect to="/login"/> }</Route>
              <Route exact path="/help">{isAuth ? <Help/> : <Redirect to="/login"/> }</Route>
              <Route exact path="/contact">{isAuth ? <Contact/> :<Redirect to="/login"/> }</Route>
              <Route exact path="/faculty">{isAuth ? <FacultyList/> :<Redirect to="/login"/> }</Route>
              <Route exact path="/faculty/:id">{isAuth ? <FacultyDetails/> :<Redirect to="/login"/> }</Route>
              <Route exact path="/login"><Login isAuth={isAuth} setIsAuth={setIsAuth}/></Route>
              <Route path="*"><Page404/></Route>
            </Switch>
        </div>
        <ScrollToTop/>
      </Router>
      <ReactQueryDevtools/>
    </QueryClientProvider>
  );
}

export default App;
