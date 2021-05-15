import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import { useState } from "react";
import { departments } from "../../serverDetails";
import { getFacultyVerification, getCourseVerification } from "../../Queries";
import { useQuery } from "react-query";
import "./Verify.css";

const Verify = () => {
  const [tab, setTab] = useState("");
  const [departmentID, setDepartmentID] = useState(1);
  const { isSuccess, isLoading, isError, error, data, isFetching } = useQuery(
    ["/api/facultyverify", departmentID],
    getFacultyVerification,
    {
      enabled: departmentID != 0 && tab === "faculty",
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
    enabled: departmentID != 0 && tab === "course",
  });
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
              setDepartmentID(e.target.value);
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
              data.data.map((faculty) => {
                return (
                  <div
                    key={faculty.facultyInitials}
                    className="verify-list-item"
                  >
                    {faculty.facultyInitials}
                  </div>
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
              setDepartmentID(e.target.value);
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
              typeof courseData !== "undefined" &&
              courseData.data.map((course) => {
                console.log(course);
                return (
                  <div key={course.courseCode} className="verify-list-item">
                    {course.courseCode}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Verify;
