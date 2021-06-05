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
import refetchicon from "../../assets/img/refetch.svg";
import TextInput from "../TextInput/TextInput";

const Verify = () => {
  const location = useLocation();
  const { isAuth } = useContext(AuthContext);
  const [tab, setTab] = useLocalStorage("verifytab", "");
  const [initials, setInitials] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [departmentID, setDepartmentID] = useLocalStorage("departmentID", "0");
  const { isSuccess, isLoading, isError, error, data, isFetching, refetch } =
    useQuery(
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
    refetch: courseRefetch,
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
      <h1 className="global-header"> Verify</h1>
      <div className="tab-btn-wrapper">
        <div
          className={tab === "faculty" ? "tab-btn tab-btn-active" : "tab-btn"}
          onClick={(e) => setTab("faculty")}
        >
          Faculty
        </div>
        <div
          className={tab === "course" ? "tab-btn tab-btn-active" : "tab-btn"}
          onClick={(e) => setTab("course")}
        >
          Course
        </div>
      </div>
      <div
        className="global-info-header"
        onClick={(event) => setShowHelp((prev) => !prev)}
      >
        {showHelp
          ? "You might be wondering why the faculty or course that you added in the contribute section didn't appear in the faculty or course list immediately. It's because since everyone can contribute, there might be wrong or incorrect data. That's why in this section through voting we decide which entry is the correct one, since the right information will get all the upvotes. So go ahead and vote. If the correct faculty or course gets at least 3 upvotes then it will be updated in the verified list automatically at about 3 A.M. every night. Likewise, entries in the verified list can be removed too. Cause you know, there would be people who will add 'TBA' as a faculty and upvote it till it's verified. To unverify, the highest upvoted entry needs to have more downvotes than upvotes and it would be removed from the verified list. Btw, thank you for reading this long tutorial :)"
          : "I'm confused! What does this section do?"}
      </div>
      {tab === "faculty" && (
        <>
          <motion.div
            whileTap={{ scale: 0.8 }}
            className="global-refetch-btn"
            onClick={() => refetch()}
          >
            <img src={refetchicon} />
            <div className="global-refetch-btn-title">Refresh</div>
          </motion.div>
          <div className="verify-wrapper">
            <select
              className="select-css select-full"
              value={departmentID}
              onChange={(e) => {
                setDepartmentID(String(e.target.value));
              }}
              style={{ marginBottom: "1em" }}
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
            <TextInput
              value={initials}
              setValue={setInitials}
              limit={3}
              finalRegex={/^[a-zA-Z]{3}$/}
              allowedRegex={/^[a-zA-Z]*$/}
              errorMsg={``}
              placeholder={`Search by initials...`}
            />
            <div className="verify-list-wrapper">
              {isSuccess &&
                typeof data !== "undefined" &&
                data.data
                  .filter((f) => {
                    if (initials.length > 0) {
                      let match = true;
                      for (var i = 0; i < initials.length; i++) {
                        if (initials[i] != f.facultyInitials[i]) {
                          match = false;
                        }
                      }

                      return match;
                    } else {
                      return true;
                    }
                  })
                  .sort((f1, f2) => {
                    return f1.facultyInitials > f2.facultyInitials ? 1 : -1;
                  })
                  .map((faculty) => {
                    return (
                      <Link
                        key={faculty.facultyInitials}
                        to={`/verify/faculty/${departmentID}/${faculty.facultyInitials}`}
                        style={{ textDecoration: "none" }}
                      >
                        <div
                          className={
                            faculty.upVoteSum > 2
                              ? "verify-list-item"
                              : "verify-list-item needs-verification"
                          }
                        >
                          <div>{faculty.facultyInitials}</div>
                          <div>
                            {faculty.upVoteSum > 2
                              ? ""
                              : `${
                                  3 - faculty.upVoteSum
                                } vote(s) needed`}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
            </div>
          </div>
        </>
      )}

      {tab === "course" && (
        <>
          <motion.div
            whileTap={{ scale: 0.8 }}
            className="global-refetch-btn"
            onClick={() => courseRefetch()}
          >
            <img src={refetchicon} />
            <div className="global-refetch-btn-title">Refresh</div>
          </motion.div>
          <div className="verify-wrapper">
            <select
              className="select-css select-full"
              value={departmentID}
              onChange={(e) => {
                setDepartmentID(String(e.target.value));
              }}
              style={{ marginBottom: "1em" }}
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
            <TextInput
              value={courseCode}
              setValue={setCourseCode}
              limit={6}
              finalRegex={/^[a-zA-Z]{3}[0-9]{3}$/}
              allowedRegex={/^[a-zA-Z0-9]*$/}
              errorMsg={``}
              placeholder={`Search by course code...`}
            />
            <div className="verify-list-wrapper">
              {isCourseSuccess &&
                typeof courseData !== "undefined" &&
                courseData.data
                  .filter((c) => {
                    if (courseCode.length > 0) {
                      let match = true;
                      for (var i = 0; i < courseCode.length; i++) {
                        if (courseCode[i] != c.courseCode[i]) {
                          match = false;
                        }
                      }
                      return match;
                    } else {
                      return true;
                    }
                  })
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
                        <div
                          className={
                            course.upVoteSum > 2
                              ? "verify-list-item"
                              : "verify-list-item needs-verification"
                          }
                        >
                          <div>{course.courseCode}</div>
                          <div>
                            {course.upVoteSum > 2
                              ? ""
                              : `${
                                  3 - course.upVoteSum
                                } vote(s) needed`}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Verify;
