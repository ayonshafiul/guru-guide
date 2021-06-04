import "./FacultyList.css";
import { motion } from "framer-motion";
import { useContext } from "react";
import pageAnimationVariant from "../../AnimationData";
import FacultyListItem from "../FacultyListItem/FacultyListItem";
import { useQuery } from "react-query";
import { getFaculty } from "../../Queries";
import { departments } from "../../serverDetails";
import useLocalStorage from "../../useLocalStorage";
import { AuthContext } from "../../contexts/AuthContext";
import { Redirect, useLocation } from "react-router-dom";
import refetchicon from "../../assets/img/refetch.svg";

const FacultyList = () => {
  const location = useLocation();
  const { isAuth } = useContext(AuthContext);
  const [departmentID, setDepartmentID] = useLocalStorage("departmentID", "1");
  const [sort, setSort] = useLocalStorage("facultylistsort", "");
  const { isSuccess, isLoading, isError, error, data, isFetching, refetch } =
    useQuery(["/api/faculty/department", String(departmentID)], getFaculty);

  function sortFunction(a, b) {
    let sortValue = 0;
    switch (sort) {
      case "rating":
        let avgA =
          (a.teaching / a.voteCount +
            a.grading / a.voteCount +
            a.friendliness / a.voteCount) /
          3;
        let avgB =
          (b.teaching / b.voteCount +
            b.grading / b.voteCount +
            b.friendliness / b.voteCount) /
          3;
        sortValue = avgB >= avgA ? 1 : -1;
        break;
      case "alphabetical":
        sortValue =
          a.facultyName.toUpperCase() > b.facultyName.toUpperCase() ? 1 : -1;
        break;
      case "teaching":
        sortValue =
          b.teaching / b.voteCount >= a.teaching / a.voteCount ? 1 : -1;
        break;
      case "grading":
        sortValue = b.grading / b.voteCount >= a.grading / a.voteCount ? 1 : -1;
        break;
      case "friendliness":
        sortValue =
          b.friendliness / b.voteCount >= a.friendliness / a.voteCount ? 1 : -1;
        break;
      case "vote":
        sortValue = b.voteCount >= a.voteCount ? 1 : -1;
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
      className="facultylist"
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      <h1 className="header"> Faculty List</h1>
      <div className="faculty-list-wrapper">
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
            <option value="rating">Overall Rating</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="teaching">Teaching</option>
            <option value="grading">Grading</option>
            <option value="friendliness">Friendliness</option>
            <option value="vote">Number of votes</option>
          </select>
        )}
        <motion.div
          whileTap={{ scale: 0.8 }}
          className="global-refetch-btn"
          onClick={() => refetch()}
        >
          <img src={refetchicon} />
          <div className="global-refetch-btn-title">Refresh</div>
        </motion.div>
        {isError ? <div>Error Fetching data...</div> : null}
        {isSuccess &&
          typeof data.data !== undefined &&
          data.data.sort(sortFunction).map((faculty) => {
            return (
              <FacultyListItem
                faculty={faculty}
                key={faculty.facultyInitials}
              />
            );
          })}
      </div>
    </motion.div>
  );
};

export default FacultyList;
