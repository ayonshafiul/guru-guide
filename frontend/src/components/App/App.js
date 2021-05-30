import Navbar from "../Navbar/Navbar";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Verify from "../Verify/Verify";
import Contribute from "../Contribute/Contribute";
import Help from "../Help/Help";
import Contact from "../Contact/Contact";
import { useState, useContext } from "react";
import FacultyList from "../FacultyList/FacultyList";
import FacultyVerify from "../FacultyVerify/FacultyVerify";
import Login from "../Login/Login";
import Page404 from "../Page404/Page404";
import Home from "../Home/Home";
import Complaint from "../Complaint/Complaint";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastProvider, useToasts } from "react-toast-notifications";
import { ReactQueryDevtools } from "react-query/devtools";
import FacultyDetails from "../FacultyDetails/FacultyDetails";
import CourseDetails from "../CourseDetails/CourseDetails";
import CourseVerify from "../CourseVerify/CourseVerify";
import CourseCombo from "../CourseCombo/CourseCombo";
import menu from "../../assets/img/menu.png";
import AuthContextProvider, { AuthContext } from "../../contexts/AuthContext";
import CourseList from "../CourseList/CourseList";
import infinity from "../../assets/img/infinity.svg";

function App() {
  const [navStyle, setNavStyle] = useState(false);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 120000,
        cacheTime: 300000,
        refetchOnMount: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider
        autoDismissTimeout="2500"
        autoDismiss="true"
        placement="top-right"
      >
        <AuthContextProvider>
          <Router>
            <Navbar navStyle={navStyle} setNavStyle={setNavStyle}></Navbar>
            <div className="header-top">
              <div
                className="menu-btn"
                onClick={() => {
                  setNavStyle((prevStyle) => {
                    return !prevStyle;
                  });
                }}
              >
                <img src={menu} style={{ width: 40, height: 40 }} />
              </div>
              <div className="spinning">
                <img src={infinity} />
              </div>
              <h1 className="title">Guruguide</h1>
            </div>

            <div className="App">
              <div className="margin-auto">
                <Switch>
                  <Route exact path="/contribute">
                    <Contribute />
                  </Route>
                  <Route exact path="/verify">
                    <Verify />
                  </Route>
                  <Route exact path="/help">
                    <Help />
                  </Route>
                  <Route exact path="/contact">
                    <Contact />
                  </Route>
                  <Route exact path="/faculty">
                    <FacultyList />
                  </Route>
                  <Route exact path="/course">
                    <CourseList />
                  </Route>
                  <Route exact path="/faculty/:id">
                    <FacultyDetails />
                  </Route>
                  <Route exact path="/course/:id">
                    <CourseDetails />
                  </Route>
                  <Route exact path="/coursecombo">
                    <CourseCombo />
                  </Route>
                  <Route exact path="/verify/faculty/:departmentID/:initials">
                    <FacultyVerify />
                  </Route>
                  <Route exact path="/verify/course/:departmentID/:code">
                    <CourseVerify />
                  </Route>
                  <Route exact path="/login">
                    <Login />
                  </Route>
                  <Route exact path="/">
                    <Home></Home>
                  </Route>
                  <Route exact path="/complaint">
                    <Complaint />
                  </Route>
                  <Route path="*">
                    <Page404 />
                  </Route>
                </Switch>
              </div>
            </div>
            <ScrollToTop />
          </Router>
        </AuthContextProvider>
      </ToastProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
