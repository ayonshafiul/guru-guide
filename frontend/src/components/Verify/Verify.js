import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import { useState, useContext } from "react";
import { departments } from "../../serverDetails";
import { getFacultyVerification, getCourseVerification } from "../../Queries";
import { useQuery } from "react-query";
import { Link, useLocation } from "react-router-dom";
import "./Verify.css";
import { AuthContext } from "../../contexts/AuthContext";
import { Redirect } from "react-router-dom";
import useLocalStorage from "../../useLocalStorage";

const Verify = () => {
  const location = useLocation();
  const { isAuth } = useContext(AuthContext);
  const [tab, setTab] = useLocalStorage("verifytab", "");
  const [departmentID, setDepartmentID] = useLocalStorage("departmentID", "0");
  const { isSuccess, isLoading, isError, error, data, isFetching } = useQuery(
    ["/api/facultyverify", String(departmentID)],
    getFacultyVerification,
    {
      enabled: parseInt(departmentID) !== 0 && tab === "faculty",
    }
  );

  const {
    isSuccess: isCourseSuccess,
    isLoading: isCourseLoading,
    isError: isCourseError,
    error: courseError,
    data: courseData,
    isFetching: isCourseFetching,
  } = useQuery(["/api/courseverify", departmentID], getCourseVerification, {
    enabled: parseInt(departmentID) !== 0 && tab === "course",
  });
  if (!isAuth)
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: location },
        }}
      ></Redirect>
    );
  return (
    <motion.div
      className="help"
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      <div className="tab-btn-wrapper">
        <div
          className={tab === "faculty" ? "tab-btn tab-btn-active" : "tab-btn"}
          onClick={(e) => setTab("faculty")}
        >
          Verify Faculty
        </div>
        <div
          className={tab === "course" ? "tab-btn tab-btn-active" : "tab-btn"}
          onClick={(e) => setTab("course")}
        >
          Verify Course
        </div>
      </div>
      {tab === "faculty" && (
        <div className="verify-wrapper">
          <select
            className="select-css select-full"
            value={departmentID}
            onChange={(e) => {
              setDepartmentID(String(e.target.value));
            }}
          >
            {departments.map((department, index) => {
              if (index != 8) {
                return (
                  <option key={department} value={index}>
                    {department}
                  </option>
                );
              }
            })}
          </select>
          <div className="verify-list-wrapper">
            {isSuccess &&
              typeof data !== "undefined" &&
              data.data
                .sort((f1, f2) => {
                  return f1.initials > f2.initials ? 1 : -1;
                })
                .map((faculty) => {
                  return (
                    <Link
                      key={faculty.facultyInitials}
                      to={`/verify/faculty/${departmentID}/${faculty.facultyInitials}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="verify-list-item">
                        {faculty.facultyInitials}
                      </div>
                    </Link>
                  );
                })}
          </div>
        </div>
      )}

      {tab === "course" && (
        <div className="verify-wrapper">
          <select
            className="select-css select-full"
            value={departmentID}
            onChange={(e) => {
              setDepartmentID(String(e.target.value));
            }}
          >
            {departments.map((department, index) => {
              if (index != 8) {
                return (
                  <option key={department} value={index}>
                    {department}
                  </option>
                );
              }
            })}
          </select>
          <div className="verify-list-wrapper">
            {isCourseSuccess &&
              typeof courseData !== "undefined" &&
              courseData.data
                .sort((f1, f2) => {
                  return f1.courseCode > f2.courseCode ? 1 : -1;
                })
                .map((course) => {
                  return (
                    <Link
                      key={course.courseCode}
                      to={`/verify/course/${departmentID}/${course.courseCode}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="verify-list-item">
                        {course.courseCode}
                      </div>
                    </Link>
                  );
                })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Verify;
