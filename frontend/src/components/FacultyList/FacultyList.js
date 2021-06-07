import "./FacultyList.css";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import pageAnimationVariant from "../../AnimationData";
import FacultyListItem from "../FacultyListItem/FacultyListItem";
import { useQuery } from "react-query";
import { getFaculty } from "../../Queries";
import { departments } from "../../serverDetails";
import useLocalStorage from "../../useLocalStorage";
import { AuthContext } from "../../contexts/AuthContext";
import { Redirect, useLocation } from "react-router-dom";
import refetchicon from "../../assets/img/refetch.svg";
import TextInput from "../TextInput/TextInput";

const FacultyList = () => {
  const location = useLocation();
  const { isAuth } = useContext(AuthContext);
  const [showHelp, setShowHelp] = useState(false);
  const [showContribute, setShowContribute] = useState(false);
  const [initials, setInitials] = useState("");
  const [departmentID, setDepartmentID] = useLocalStorage("departmentID", "1");
  const [sort, setSort] = useLocalStorage("facultylistsort", "");
  const { isSuccess, isLoading, isError, error, data, isFetching, refetch } =
    useQuery(["/api/faculty/department", String(departmentID)], getFaculty);

  function sortFunction(a, b) {
    let sortValue = 0;
    switch (sort) {
      case "rating":
        let avgA =
          a.voteCount != 0
            ? (a.teaching / a.voteCount +
                a.grading / a.voteCount +
                a.friendliness / a.voteCount) /
              3
            : 0;
        let avgB =
          b.voteCount != 0
            ? (b.teaching / b.voteCount +
                b.grading / b.voteCount +
                b.friendliness / b.voteCount) /
              3
            : 0;
        sortValue = avgB >= avgA ? 1 : -1;
        break;
      case "alphabetical":
        sortValue =
          a.facultyName.toUpperCase() >= b.facultyName.toUpperCase() ? 1 : -1;
        break;
      case "teaching":
        sortValue =
          (b.voteCount != 0 ? b.teaching / b.voteCount : 0) >=
          (a.voteCount != 0 ? a.teaching / a.voteCount : 0)
            ? 1
            : -1;
        break;
      case "grading":
        sortValue =
          (b.voteCount != 0 ? b.grading / b.voteCount : 0) >=
          (a.voteCount != 0 ? a.grading / a.voteCount : 0)
            ? 1
            : -1;
        break;
      case "friendliness":
        sortValue =
          (b.voteCount != 0 ? b.friendliness / b.voteCount : 0) >=
          (a.voteCount != 0 ? a.friendliness / a.voteCount : 0)
            ? 1
            : -1;

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
      <div
        className="global-btn-full"
        onClick={() => {
          setShowContribute((prev) => !prev);
        }}
      >
        Add faculty in <span className="red">{departments[departmentID]}</span>{" "}
        department
      </div>
      {showContribute && (
        <>
          <div className="global-info-text"></div>
          {parseInt(departmentID) !== 0 && (
            <div className="input">
              <TextInput
                value={initials}
                setValue={setInitials}
                limit={3}
                finalRegex={/^[a-zA-Z]{3}$/}
                allowedRegex={/^[a-zA-Z]*$/}
                errorMsg={`Type something like "ARF"`}
                placeholder={`Faculty Initials`}
              />
            </div>
          )}
        </>
      )}
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
        <div
          className="global-info-header"
          onClick={(event) => setShowHelp((prev) => !prev)}
        >
          {showHelp
            ? "Here you'll see all the verified faculties. You can go ahead and say nice things about them or better yet, show your appreciation in the rating section. Please keep in mind that you can give multiple reviews and/or ratings for multiple courses they teach. If you can't find your favorite faculty in this list then head over to contribute section and add information about your favorite faculty yourself!."
            : "I'm confused! What does this section do?"}
        </div>
        <motion.div
          whileTap={{ scale: 0.8 }}
          className="global-refetch-btn"
          onClick={() => refetch()}
        >
          <img src={refetchicon} />
          <div className="global-refetch-btn-title">Refresh</div>
        </motion.div>
        {isError ? <div>Couldn't load faculty data...</div> : null}
        {isSuccess && typeof data !== "undefined"
          ? data.data.sort(sortFunction).map((faculty) => {
              return (
                <FacultyListItem
                  faculty={faculty}
                  key={faculty.facultyInitials}
                />
              );
            })
          : null}
      </div>
    </motion.div>
  );
};

export default FacultyList;
