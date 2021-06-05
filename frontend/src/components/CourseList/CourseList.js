import "./CourseList.css";
import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { getCourse } from "../../Queries";
import { departments } from "../../serverDetails";
import useLocalStorage from "../../useLocalStorage";
import { AuthContext } from "../../contexts/AuthContext";
import { Redirect, useLocation } from "react-router-dom";
import CourseListItem from "../CourseListItem/CourseListItem";
import refetchicon from "../../assets/img/refetch.svg";

const CourseList = () => {
  const location = useLocation();
  const { isAuth } = useContext(AuthContext);
  const [showHelp, setShowHelp] = useState(false);
  const [departmentID, setDepartmentID] = useLocalStorage("departmentID", "1");
  const [sort, setSort] = useLocalStorage("courselistsort", "");
  const { isSuccess, isLoading, isError, error, data, isFetching, refetch } =
    useQuery(["/api/course/department", String(departmentID)], getCourse);

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
      <div
        className="global-info-header"
        onClick={(event) => setShowHelp((prev) => !prev)}
      >
        {showHelp
          ? "Here you'll see all verified courses in each deparment. You can go ahead and post a review about each course or give a rating on the difficulty level. If you can't find the course then head over to the contribute section and add information about  that course."
          : "What's this?"}
      </div>
      <motion.div
        whileTap={{ scale: 0.8 }}
        className="global-refetch-btn"
        onClick={() => refetch()}
      >
        <img src={refetchicon} />
        <div className="global-refetch-btn-title">Refresh</div>
      </motion.div>
      {isSuccess &&
        typeof data.data !== undefined &&
        data.data.sort(sortFunction).map((course) => {
          return <CourseListItem course={course} key={course.courseID} />;
        })}
    </motion.div>
  );
};

export default CourseList;
