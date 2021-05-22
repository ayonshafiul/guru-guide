import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import "../FacultyDetails/FacultyDetails.css";
import "./Contribute.css";
import { departments } from "../../serverDetails";
import TextInput from "../TextInput/TextInput";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import {
  postCourse,
  postFaculty,
  getAFacultyVerification,
  postFacultyVote,
} from "../../Queries";
import up from "../../assets/img/up.png";
import down from "../../assets/img/down.png";
import { useToasts } from "react-toast-notifications";
const Contribute = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToasts();
  const [tab, setTab] = useState("");
  const [departmentID, setDepartmentID] = useState(0);
  const [initials, setInitials] = useState("");
  const [showFacultyVerification, setShowFacultyVerification] = useState(false);
  const [showName, setShowName] = useState(false);
  const [name, setName] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const { isSuccess, isLoading, isError, error, data, isFetching, refetch } =
    useQuery(
      ["/api/facultyverify", String(departmentID), String(initials)],
      getAFacultyVerification,
      {
        enabled: departmentID !== 0 && initials.length == 3,
      }
    );
  async function submitFaculty() {
    const inRegex = /^[a-zA-Z]{3}$/;
    const nameRegex = /^$/;
    if (
      departmentID != 0 &&
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
    const ccRegex = /^[a-zA-Z]{3}[0-9]{3}$/;
    if (
      departmentID != 0 &&
      courseCode.match(ccRegex) &&
      courseTitle.length >= 3 &&
      courseTitle.length <= 50
    ) {
      const data = await postCourse({ departmentID, courseCode, courseTitle });
      if (data.success) {
        addToast("Thanks for your contribution!");
      }
    }
  }
  async function submitVote(facultyID, voteType) {
    const data = await postFacultyVote({ voteType, facultyID });
    const cacheExists = queryClient.getQueryData([
      "/api/facultyverify",
      String(departmentID),
      String(initials),
    ]);
    if (cacheExists) {
      queryClient.setQueryData(
        ["/api/facultyverify", String(departmentID), String(initials)],
        (prevData) => {
          for (let i = 0; i < prevData.data.length; i++) {
            let currentFaculty = prevData.data[i];
            if (currentFaculty.facultyID == facultyID) {
              switch (data.message) {
                case "upvoteinsert":
                  setShowName(false);
                  currentFaculty.upVoteSum = currentFaculty.upVoteSum + 1;
                  addToast("Thanks for your contribution!");
                  setInitials("");
                  break;
                case "downvoteinsert":
                  setShowName(true);
                  currentFaculty.downVoteSum = currentFaculty.downVoteSum + 1;
                  break;
                case "upvoteupdate":
                  setShowName(false);
                  currentFaculty.upVoteSum = currentFaculty.upVoteSum + 1;
                  currentFaculty.downVoteSum = currentFaculty.downVoteSum - 1;
                  addToast("Thanks for your contribution!");
                  setInitials("");
                  break;
                case "downvoteupdate":
                  setShowName(true);
                  currentFaculty.downVoteSum = currentFaculty.downVoteSum + 1;
                  currentFaculty.upVoteSum = currentFaculty.upVoteSum - 1;
                  break;
                case "noupdate":
                  addToast("Thanks for your contribution!");
                  setInitials("");
                  setShowName(false);
                  break;
              }
            }
          }
          return prevData;
        }
      );
    } else {
      switch (data.message) {
        case "upvoteinsert":
          setShowName(false);
          addToast("Thanks for your contribution!");
          setInitials("");
          break;
        case "downvoteinsert":
          setShowName(true);
          break;
        case "upvoteupdate":
          setShowName(false);
          addToast("Thanks for your contribution!");
          setInitials("");
          break;
        case "downvoteupdate":
          setShowName(true);
          break;
        case "noupdate":
          addToast("Thanks for your contribution!");
          setInitials("");
          setShowName(false);
          break;
      }
    }
  }
  return (
    <motion.div
      className="verify"
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      <div className="tab-btn-wrapper">
        <div
          className={tab === "faculty" ? "tab-btn tab-btn-active" : "tab-btn"}
          onClick={(e) => setTab("faculty")}
        >
          Add Faculty
        </div>
        <div
          className={tab === "course" ? "tab-btn tab-btn-active" : "tab-btn"}
          onClick={(e) => setTab("course")}
        >
          Add Course
        </div>
      </div>
      {tab === "faculty" && (
        <>
          <div className="verify-wrapper">
            <div className="section-title">Faculty Add</div>
            <select
              className="select-css select-full"
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
            <div className="input">
              <TextInput
                value={initials}
                setValue={setInitials}
                limit={3}
                finalRegex={/^[a-zA-Z]{3}$/}
                allowedRegex={/^[a-zA-Z]*$/}
                errorMsg={`Type something like "TBA" :)`}
                placeholder={`Type the initials of the faculty you would like to add to the database`}
              />
            </div>
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
                                      submitVote(faculty.facultyID, 1);
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
                                      submitVote(faculty.facultyID, 0);
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
                              errorMsg={`Type something like "To Be Announced" :)`}
                              placeholder={`Type the full name of the faculty you would like to add to the database`}
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

            {showName && (
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
                    errorMsg={`Type something like "To Be Announced" :)`}
                    placeholder={`Type the full name of the faculty you would like to add to the database`}
                  />
                </div>
                <div className="submit-btn" onClick={submitFaculty}>
                  Add Faculty
                </div>{" "}
              </>
            )}
          </div>
        </>
      )}

      {tab === "course" && (
        <>
          <div className="verify-wrapper">
            <div className="section-title">Course Add</div>
            <select
              className="select-css select-full"
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
            <div className="input">
              <TextInput
                value={courseCode}
                setValue={setCourseCode}
                limit={6}
                type=""
                finalRegex={/^[a-zA-Z]{3}[0-9]{3}$/}
                allowedRegex={/^[a-zA-Z0-9]*$/}
                errorMsg={`Type something like "CSE420" :)`}
                placeholder={`Type the course code of the course you would like to add to the database`}
              />
            </div>
            <div className="input">
              <TextInput
                value={courseTitle}
                setValue={setCourseTitle}
                limit={50}
                type=""
                finalRegex={/^[a-zA-Z ]{3, 50}$/}
                allowedRegex={/^[a-zA-Z ]*$/}
                errorMsg={`Type something like "Introduction to microfinance" :)`}
                placeholder={`Type the full title of the course you would like to add to the database`}
              />
            </div>
            <div className="submit-btn" onClick={submitCourse}>
              Add Course
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Contribute;
