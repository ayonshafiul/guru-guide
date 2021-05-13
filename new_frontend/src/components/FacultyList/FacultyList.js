import "./FacultyList.css";
import { motion } from "framer-motion";
import { useState } from "react";
import pageAnimationVariant from "../../AnimationData";
import FacultyListItem from "../FacultyListItem/FacultyListItem";
import { useQuery } from "react-query";
import { getFaculty } from "../../Queries";

const FacultyList = () => {
  const [departmentID, setDepartmentID] = useState(3);
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
      {isError ? <div>Error Fetching data...</div> : null}
      {isSuccess &&
        data.data.map((faculty) => {
          console.log(faculty);
          return <FacultyListItem faculty={faculty} key={faculty.facultyID} />;
        })}
    </motion.div>
  );
};

export default FacultyList;
