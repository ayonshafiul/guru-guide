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
    switch (sort) {
      case "rating":
        let avgA = a.teaching + a.grading + a.friendliness;
        let avgB = b.teaching + b.grading + b.friendliness;
        return avgB - avgA;
        break;
      case "alphabetical":
        return a.facultyName.toUpperCase() > b.facultyName.toUpperCase() ? 1 : -1;
        break;
      case "teaching":
        return b.teaching - a.teaching;
        break;
      case "grading":
        return b.grading - a.grading;
        break;
      case "friendliness":
        return b.friendliness - a.friendliness;
        break;
    }
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
