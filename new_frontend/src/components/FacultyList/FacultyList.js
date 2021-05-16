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
  const { isSuccess, isLoading, isError, error, data, isFetching } = useQuery(
    ["/api/faculty", departmentID],
    getFaculty
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
        {isError ? <div>Error Fetching data...</div> : null}
        {isSuccess &&
          typeof data != undefined &&
          data.data.map((faculty) => {
            return (
              <FacultyListItem faculty={faculty} key={faculty.facultyID} />
            );
          })}
      </div>
    </motion.div>
  );
};

export default FacultyList;
