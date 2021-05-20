import "./FacultyList.css";
import { motion } from "framer-motion";
import { useState } from "react";
import pageAnimationVariant from "../../AnimationData";
import FacultyListItem from "../FacultyListItem/FacultyListItem";
import { useQuery } from "react-query";
import { getFaculty } from "../../Queries";
import { departments } from "../../serverDetails";

const FacultyList = () => {
  const [departmentID, setDepartmentID] = useState(0);
  const [sort, setSort] = useState("");
  const { isSuccess, isLoading, isError, error, data, isFetching } = useQuery(
    ["/api/faculty", String(departmentID)],
    getFaculty
  );

  function sortFunction(a, b) {
    let sortValue = 0;
    switch (sort) {
      case "rating":
        let avgA = (a.teaching + a.grading + a.friendliness) / a.voteCount;
        let avgB = (b.teaching + b.grading + b.friendliness) / b.voteCount;
        sortValue = avgB >= avgA ? 1 : -1;
        break;
      case "alphabetical":
        sortValue = a.facultyName.toUpperCase() > b.facultyName.toUpperCase() ? 1 : -1;
        break;
      case "teaching":
        console.log(a.teaching, b.teaching);
        sortValue = b.teaching >= a.teaching ? 1 : -1;
        break;
      case "grading":
        sortValue = b.grading >= a.grading ? 1 : -1;
        break;
      case "friendliness":
        sortValue = b.friendliness >= a.friendliness ? 1 : -1;
        break;
      case "vote":
        console.log(a.voteCount, b.voteCount);
        sortValue = b.voteCount >= a.voteCount ? 1 : -1;
        break;
    }
    return sortValue;
  }
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
        {isError ? <div>Error Fetching data...</div> : null}
        {isSuccess &&
          typeof data != undefined &&
          data.data.sort(sortFunction).map((faculty) => {
            return (
              <FacultyListItem faculty={faculty} key={faculty.facultyID} />
            );
          })}
      </div>
    </motion.div>
  );
};

export default FacultyList;
