import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import "../FacultyDetails/FacultyDetails.css";
import "./Contribute.css";
import { departments } from "../../serverDetails";
import TextInput from "../TextInput/TextInput";
import { useState, useContext } from "react";
import { useQuery, useQueryClient } from "react-query";
import {
  postCourse,
  postFaculty,
  getAFacultyVerification,
  getACourseVerification,
  postFacultyVote,
  postCourseVote,
} from "../../Queries";
import up from "../../assets/img/up.png";
import down from "../../assets/img/down.png";
import { useToasts } from "react-toast-notifications";
import { AuthContext } from "../../contexts/AuthContext";
import { Redirect, useLocation } from "react-router-dom";
import useLocalStorage from "../../useLocalStorage";
const Contribute = () => {
  const location = useLocation();
  const { isAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { addToast } = useToasts();
  const [tab, setTab] = useLocalStorage("contributetab", "");
  const [departmentID, setDepartmentID] = useLocalStorage("departmentID", "0");
  const [initials, setInitials] = useState("");
  const [showName, setShowName] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [name, setName] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const inRegex = /^[a-zA-Z]{3}$/;
  const ccRegex = /^[a-zA-Z]{3}[0-9]{3}$/;
  const { isSuccess, data, refetch } = useQuery(
    ["/api/facultyverify", departmentID, String(initials)],
    getAFacultyVerification,
    {
      enabled: parseInt(departmentID) !== 0 && initials.length == 3,
    }
  );
  const {
    isSuccess: isCourseSuccess,
    data: courseData,
    refetch: courseRefetch,
  } = useQuery(
    ["/api/courseverify", departmentID, String(courseCode)],
    getACourseVerification,
    {
      enabled:
        parseInt(departmentID) !== 0 &&
        courseCode.length == 6 &&
        !!courseCode.match(ccRegex),
    }
  );
  async function submitFaculty() {
    if (
      parseInt(departmentID) !== 0 &&
      initials.match(inRegex) &&
      name.length >= 3 &&
      name.length <= 50
    ) {
      const data = await postFaculty({
        departmentID,
        facultyInitials: initials,
        facultyName: name,
      });
      if (data.success) {
        refetch();
        setName("");
        setInitials("");
        setShowName(false);
        addToast("Thanks for your contribution!");
      }
    }
  }

  async function submitCourse() {
    if (
      parseInt(departmentID) !== 0 &&
      courseCode.match(ccRegex) &&
      courseTitle.length >= 3 &&
      courseTitle.length <= 50
    ) {
      const data = await postCourse({ departmentID, courseCode, courseTitle });
      if (data.success) {
        courseRefetch();
        setCourseCode("");
        setCourseTitle("");
        setShowTitle(false);
        addToast("Thanks for your contribution!");
      }
    } else {
      addToast("Please type a valide course code.");
    }
  }
  async function submitVote(type, id, voteType) {
    let data = null;
    let key = [];
    if (type === "faculty") {
      data = await postFacultyVote({ voteType, facultyID: id });
      key = ["/api/facultyverify", departmentID, String(initials)];
    } else {
      data = await postCourseVote({ voteType, courseID: id });
      key = ["/api/courseverify", departmentID, String(courseCode)];
    }
    const cacheExists = queryClient.getQueryData(key);
    if (cacheExists) {
      queryClient.setQueryData(key, (prevData) => {
        for (let i = 0; i < prevData.data.length; i++) {
          let currentItem = prevData.data[i];

          if (
            (type === "faculty" && currentItem.facultyID == id) ||
            (type === "course" && currentItem.courseID == id)
          ) {
            switch (data.message) {
              case "upvoteinsert":
                if (type === "faculty") setShowName(false);
                else setShowTitle(false);
                currentItem.upVoteSum = currentItem.upVoteSum + 1;
                addToast("Thanks for your contribution!");
                if (type === "faculty") setInitials("");
                else setCourseCode("");
                break;
              case "downvoteinsert":
                if (type === "faculty") setShowName(true);
                else setShowTitle(true);
                currentItem.downVoteSum = currentItem.downVoteSum + 1;
                break;
              case "upvoteupdate":
                if (type === "faculty") setShowName(false);
                else setShowTitle(false);
                currentItem.upVoteSum = currentItem.upVoteSum + 1;
                currentItem.downVoteSum = currentItem.downVoteSum - 1;
                addToast("Thanks for your contribution!");
                if (type === "faculty") setInitials("");
                else setCourseCode("");
                break;
              case "downvoteupdate":
                if (type === "faculty") setShowName(true);
                else setShowTitle(true);
                currentItem.downVoteSum = currentItem.downVoteSum + 1;
                currentItem.upVoteSum = currentItem.upVoteSum - 1;
                break;
              case "noupdate":
                addToast("Thanks for your contribution!");
                if (type === "faculty") {
                  setInitials("");
                  setShowName(false);
                } else {
                  setCourseCode("");
                  setShowTitle(false);
                }
                break;
            }
          }
        }
        return prevData;
      });
    } else {
      switch (data.message) {
        case "upvoteinsert":
          if (type === "faculty") setShowName(false);
          else setShowTitle(false);
          addToast("Thanks for your contribution!");
          if (type === "faculty") setInitials("");
          else setCourseCode("");
          break;
        case "downvoteinsert":
          if (type === "faculty") setShowName(true);
          else setShowTitle(true);
          break;
        case "upvoteupdate":
          if (type === "faculty") setShowName(false);
          else setShowTitle(false);
          addToast("Thanks for your contribution!");
          if (type === "faculty") setInitials("");
          else setCourseCode("");
          break;
        case "downvoteupdate":
          if (type === "faculty") setShowName(true);
          else setShowTitle(true);
          break;
        case "noupdate":
          addToast("Thanks for your contribution!");
          if (type === "faculty") {
            setInitials("");
            setShowName(false);
          } else {
            setCourseCode("");
            setShowTitle(false);
          }
          break;
      }
    }
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
      className="verify"
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      <h1 className="global-header"> Contribute</h1>
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
          ? "We all take about four courses each semester. So we know about the the courses and the faculties who take them. In theory, if each of us write the information about the faculties and courses we have taken, then we'll have a complete listing of all the faculties and courses in each department. So go ahead and give those little bits of information like faculty initials and faculty name or course code and course title. Please keep in mind that, after contributing, you should also verify by giving an upvote or downvote in the verify section. Cause you know, not everyone can type accurately all the time."
          : "What's this?"}
      </div>
      {tab === "faculty" && (
        <>
          <div className="contribute-verify-wrapper">
            <div className="section-title">Contribute Faculty</div>
            <select
              className="select-css select-full"
              value={departmentID}
              onChange={(e) => {
                setDepartmentID(String(e.target.value));
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
            {initials.length == 3 && (
              <>
                {isSuccess && typeof data != undefined ? (
                  data.data.length > 0 ? (
                    <>
                      <div>
                        We already have some info about {initials}. Please
                        verify whether the info is right or wrong.
                      </div>
                      {data.data
                        .sort((f1, f2) => {
                          return f2.upVoteSum - f1.upVoteSum;
                        })
                        .map((faculty) => {
                          return (
                            <div
                              key={faculty.facultyID}
                              className="faculty-verify-list-wrapper"
                            >
                              <div className="faculty-verify-list-vote">
                                <div className="faculty-verify-vote">
                                  <div
                                    className="icon up"
                                    onClick={() => {
                                      submitVote(
                                        "faculty",
                                        faculty.facultyID,
                                        1
                                      );
                                    }}
                                  >
                                    <img className="icon-img" src={up} />
                                  </div>
                                  <div className="faculty-verify-vote-count">
                                    {faculty.upVoteSum}
                                  </div>
                                </div>
                                <div className="faculty-verify-vote">
                                  <div
                                    className="icon down"
                                    onClick={() => {
                                      submitVote(
                                        "faculty",
                                        faculty.facultyID,
                                        0
                                      );
                                    }}
                                  >
                                    <img className="icon-img" src={down} />
                                  </div>
                                  <div className="faculty-verify-vote-count">
                                    {faculty.downVoteSum}
                                  </div>
                                </div>
                              </div>
                              <div className="faculty-verify-name">
                                {faculty.facultyName}{" "}
                              </div>
                              <div className="faculty-verify-initials">
                                {faculty.facultyInitials}{" "}
                              </div>
                            </div>
                          );
                        })}
                    </>
                  ) : (
                    (() => {
                      return (
                        <>
                          <div className="input">
                            <TextInput
                              value={name}
                              setValue={setName}
                              limit={50}
                              finalRegex={/^[a-zA-Z ]{3, 50}$/}
                              allowedRegex={/^[a-zA-Z ]*$/}
                              errorMsg={`Type something like "ARIF SHAKIL"`}
                              placeholder={`Full name of the faculty`}
                            />
                          </div>
                          <div className="submit-btn" onClick={submitFaculty}>
                            Add Faculty
                          </div>{" "}
                        </>
                      );
                    })()
                  )
                ) : null}
              </>
            )}

            {showName && initials.length === 3 && parseInt(departmentID) !== 0 && (
              <>
                <div>
                  Since you think that the info is wrong, please feel free to
                  add the correct info about {initials}.
                </div>
                <div className="input">
                  <TextInput
                    value={name}
                    setValue={setName}
                    limit={50}
                    finalRegex={/^[a-zA-Z ]{3, 50}$/}
                    allowedRegex={/^[a-zA-Z ]*$/}
                    errorMsg={`Type something like "ARIF SHAKIL"`}
                    placeholder={`Full name of the faculty`}
                  />
                </div>
                <div className="submit-btn" onClick={submitFaculty}>
                  Add Faculty
                </div>
              </>
            )}
          </div>
        </>
      )}

      {tab === "course" && (
        <>
          <div className="contribute-verify-wrapper">
            <div className="section-title">Contribute Course</div>
            <select
              className="select-css select-full"
              value={departmentID}
              onChange={(e) => {
                setDepartmentID(String(e.target.value));
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
            {parseInt(departmentID) !== 0 && (
              <div className="input">
                <TextInput
                  value={courseCode}
                  setValue={setCourseCode}
                  limit={6}
                  type=""
                  finalRegex={/^[a-zA-Z]{3}[0-9]{3}$/}
                  allowedRegex={/^[a-zA-Z0-9]*$/}
                  errorMsg={`Type something like "CSE110" :)`}
                  placeholder={`Course Code`}
                />
              </div>
            )}

            {courseCode.length === 6 && courseCode.match(ccRegex) && (
              <>
                {isCourseSuccess && typeof courseData != undefined ? (
                  courseData.data.length > 0 ? (
                    <>
                      <div>
                        We already have some info about {courseCode}. Please
                        verify whether the info is right or wrong.
                      </div>
                      {courseData.data
                        .sort((c1, c2) => {
                          return c2.upVoteSum - c1.upVoteSum;
                        })
                        .map((course) => {
                          return (
                            <div
                              key={course.courseID}
                              className="course-verify-list-wrapper"
                            >
                              <div className="course-verify-list-vote">
                                <div className="course-verify-vote">
                                  <div
                                    className="icon up"
                                    onClick={() => {
                                      submitVote("course", course.courseID, 1);
                                    }}
                                  >
                                    <img className="icon-img" src={up} />
                                  </div>
                                  <div className="course-verify-vote-count">
                                    {course.upVoteSum}
                                  </div>
                                </div>
                                <div className="course-verify-vote">
                                  <div
                                    className="icon down"
                                    onClick={() => {
                                      submitVote("course", course.courseID, 0);
                                    }}
                                  >
                                    <img className="icon-img" src={down} />
                                  </div>
                                  <div className="course-verify-vote-count">
                                    {course.downVoteSum}
                                  </div>
                                </div>
                              </div>
                              <div className="course-verify-title">
                                {course.courseTitle}{" "}
                              </div>
                              <div className="course-verify-code">
                                {course.courseCode}
                              </div>
                            </div>
                          );
                        })}
                    </>
                  ) : (
                    (() => {
                      return (
                        <>
                          <div className="input">
                            <TextInput
                              value={courseTitle}
                              setValue={setCourseTitle}
                              limit={50}
                              type=""
                              finalRegex={/^[a-zA-Z ]{3, 50}$/}
                              allowedRegex={/^[a-zA-Z ]*$/}
                              errorMsg={`Type something like "PROGRAMMING LANGUAGE I" :)`}
                              placeholder={`Full title of the course`}
                            />
                          </div>
                          <div className="submit-btn" onClick={submitCourse}>
                            Add Course
                          </div>
                        </>
                      );
                    })()
                  )
                ) : null}
              </>
            )}
            {showTitle &&
              courseCode.length == 6 &&
              parseInt(departmentID) !== 0 && (
                <>
                  <div>
                    Since you think that the info is wrong, please feel free to
                    add the correct info about {courseCode}.
                  </div>
                  <div className="input">
                    <TextInput
                      value={courseTitle}
                      setValue={setCourseTitle}
                      limit={50}
                      type=""
                      finalRegex={/^[a-zA-Z ]{3, 50}$/}
                      allowedRegex={/^[a-zA-Z ]*$/}
                      errorMsg={`Type something like "PROGRAMMING LANGUAGE I"`}
                      placeholder={`Full title of the course`}
                    />
                  </div>
                  <div className="submit-btn" onClick={submitCourse}>
                    Add Course
                  </div>
                </>
              )}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Contribute;
