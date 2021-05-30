import "./CourseList.css";
import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import { useContext } from "react";
import { useQuery } from "react-query";
import { getCourse } from "../../Queries";
import { departments } from "../../serverDetails";
import useLocalStorage from "../../useLocalStorage";
import { AuthContext } from "../../contexts/AuthContext";
import { Redirect, useLocation } from "react-router-dom";
import CourseListItem from "../CourseListItem/CourseListItem";

const CourseList = () => {
  const location = useLocation();
  const { isAuth } = useContext(AuthContext);
  const [departmentID, setDepartmentID] = useLocalStorage("departmentID", "1");
  const [sort, setSort] = useLocalStorage("courselistsort", "");
  const { isSuccess, isLoading, isError, error, data, isFetching } = useQuery(
    ["/api/course/department", String(departmentID)],
    getCourse
  );

  function sortFunction(a, b) {
    let sortValue = 0;
    switch (sort) {
      case "difficulty":
        let avgA = 0;
        let avgB = 0;
        if (a.rateCount !== 0) {
          avgA = a.difficulty / a.rateCount;
        }
        if (b.rateCount !== 0) {
          avgB = b.difficulty / b.rateCount;
        }
        sortValue = avgB >= avgA ? -1 : 1;
        break;
      case "coursecode":
        sortValue =
          a.courseCode.toUpperCase() >= b.courseCode.toUpperCase() ? 1 : -1;
        break;
      case "vote":
        sortValue = b.rateCount >= a.rateCount ? 1 : -1;
        break;
    }
    return sortValue;
  }
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
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      <h1 className="global-header"> Course List</h1>
      <div className="general-wrapper">
        <select
          className="select-css select-css-full"
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
        {departmentID != 0 && (
          <select
            className="select-css select-css-full"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
            }}
          >
            <option value="">Sort By</option>
            <option value="difficulty">Difficulty Level</option>
            <option value="coursecode">Course Code</option>
            <option value="vote">Number of votes</option>
          </select>
        )}
      </div>
      {isSuccess &&
        typeof data.data !== undefined &&
        data.data.sort(sortFunction).map((course) => {
          return <CourseListItem course={course} key={course.courseID} />;
        })}
    </motion.div>
  );
};

export default CourseList;
