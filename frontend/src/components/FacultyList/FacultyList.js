import "./FacultyList.css";
import { motion } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import pageAnimationVariant from "../../AnimationData";
import FacultyListItem from "../FacultyListItem/FacultyListItem";
import { useQuery } from "react-query";
import {
  getFaculty,
  getAFacultyByInitials,
  getAFacultyVerification,
  postFaculty,
  postFacultyVote,
  postFacultyVerifyVote,
} from "../../Queries";
import { departments } from "../../serverDetails";
import useLocalStorage from "../../useLocalStorage";
import { AuthContext } from "../../contexts/AuthContext";
import { Redirect, useLocation } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import refetchicon from "../../assets/img/refetch.svg";
import TextInput from "../TextInput/TextInput";
import VerifyConsent from "../VerifyConsent/VerifyConsent";
import VerifyPicker from "../VerifyPicker/VerifyPicker";

const FacultyList = () => {
  const location = useLocation();
  const { isAuth } = useContext(AuthContext);
  const { addToast } = useToasts();
  const [showHelp, setShowHelp] = useState(false);
  const [showContribute, setShowContribute] = useState(false);
  const [legitFaculty, setLegitFaculty] = useState("");
  const [legitFacultyID, setLegitFacultyID] = useState(0);
  const [showVerifyPicker, setShowVerifyPicker] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [initials, setInitials] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [departmentID, setDepartmentID] = useLocalStorage("departmentID", "1");
  const [sort, setSort] = useLocalStorage("facultylistsort", "");
  const { isSuccess, isLoading, isError, error, data, isFetching, refetch } =
    useQuery(["/api/faculty/department", String(departmentID)], getFaculty);

  const {
    isSuccess: facultyIsSuccess,
    data: facultyData,
    refetch: facultyRefetch,
  } = useQuery(
    ["/api/faculty/initials", departmentID, String(initials)],
    getAFacultyByInitials,
    {
      enabled: parseInt(departmentID) !== 0 && initials.length === 3,
    }
  );

  const {
    isSuccess: facultyVerifyIsSuccess,
    data: facultyVerifyData,
    refetch: facultyVerifyRefetch,
  } = useQuery(
    ["/api/facultyverify", String(departmentID), String(initials)],
    getAFacultyVerification,
    {
      enabled: parseInt(departmentID) !== 0 && initials.length === 3,
      onSuccess: function (data) {
        console.log(data);
      },
    }
  );

  function resetContribute() {
    setLegitFacultyID(0);
    setLegitFaculty("");
    setShowInput(false);
    setShowVerifyPicker(false);
    setFacultyName("");
  }
  async function submitFacultyVote() {
    if (legitFaculty === "yes") {
      if (typeof facultyData !== "undefined") {
        if (facultyData.data.length > 0) {
          const data = await postFacultyVote({
            voteType: 1,
            fuid: facultyData.data[0].fuid,
          });
          if (data.success) {
            addToast("Thanks for your contribution!");
            resetContribute();
            setShowContribute(false);
          }
        }
      }
    } else {
      if (typeof facultyData !== "undefined") {
        facultyRefetch(); // to make sure the duplicateCount is updated
        facultyVerifyRefetch(); // to get the latest data
        if (facultyData.data.length > 0) {
          if (facultyData.data[0].duplicateCount > 0) {
            setShowVerifyPicker(true);
          } else {
            // no duplicates found so downVote instead and get the input
            if (typeof facultyData !== "undefined") {
              if (facultyData.data.length > 0) {
                const data = await postFacultyVote({
                  voteType: 0,
                  fuid: facultyData.data[0].fuid,
                });
                if (data.success) {
                  setShowInput(true);
                }
              }
            }
          }
        }
      }
    }
  }

  async function submitFaculty() {
    if (initials.length === 3 && facultyName.length >= 3) {
      const res = await postFaculty({
        departmentID,
        facultyInitials: initials,
        facultyName,
      });
      if (res.success) {
        addToast("Thanks for your contribution!");
        resetContribute();
        setShowContribute(false);
        refetch();
        facultyRefetch();
      }
    } else {
      addToast("Please enter at least 3 characters for Faculty Name!");
    }
  }

  async function submitFacultyAndFacultyVerifyVote(event, fuid, facultyID) {
    if (legitFacultyID === -1) {
      if (typeof facultyData !== "undefined") {
        if (facultyData.data.length > 0) {
          const data = await postFacultyVote({
            voteType: 0,
            fuid: facultyData.data[0].fuid,
          });
          if (data.success) {
            setShowInput(true);
          }
        }
      }
    } else if (parseInt(legitFacultyID) === 0) {
      addToast("Please select a option from the list!");
    } else {
      if (typeof facultyData !== "undefined") {
        if (facultyData.data.length > 0) {
          const res = await postFacultyVerifyVote({
            voteType: 1,
            facultyID: legitFacultyID,
          });
          if (res.success) {
            if (facultyData.data.length > 0) {
              const data = await postFacultyVote({
                voteType: 0,
                fuid: facultyData.data[0].fuid,
              });
              if (data.success) {
                addToast("Thanks for your contribution!");
                resetContribute();
                setShowContribute(false);
              }
            }
          }
        }
      }
    }
  }

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

  useEffect(() => {
    if (initials.length < 3) {
      console.log("use");
      resetContribute();
    }
  }, [initials]);
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
      {showContribute}
      <div
        className="global-btn-full"
        onClick={() => {
          setShowContribute((prev) => !prev);
          setInitials("");
          setLegitFaculty("");
          setLegitFacultyID(0);
          setFacultyName("");
          setShowInput(false);
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
          {initials.length === 3 && typeof facultyData !== "undefined" && (
            <>
              {facultyData.data.length > 0 ? (
                <>
                  <div className="global-info-text">
                    We have the following information in our database:{" "}
                  </div>
                  <FacultyListItem
                    faculty={facultyData.data[0]}
                    key={facultyData.data.facultyInitials}
                  />
                  <VerifyConsent
                    question="Are the faculty initals and faculty name given above correct?"
                    yesButtonHandler={() => {
                      console.log("yes");
                      setLegitFaculty("yes");
                    }}
                    noButtonHandler={() => {
                      setLegitFaculty("no");
                    }}
                    answerStateVariable={legitFaculty}
                  />
                  {legitFaculty === "yes" || legitFaculty === "no" ? (
                    <div
                      className="global-btn-full"
                      onClick={submitFacultyVote}
                    >
                      {legitFaculty === "yes"
                        ? "Yes, the informations is correct"
                        : "No, the information is wrong."}
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  <TextInput
                    value={facultyName}
                    setValue={setFacultyName}
                    limit={50}
                    finalRegex={/^[a-zA-Z ]{3, 50}$/}
                    allowedRegex={/^[a-zA-Z ]*$/}
                    errorMsg={`Type something like "ARIF SHAKIL"`}
                    placeholder={`Full name of the faculty`}
                  />
                  <div className="submit-btn" onClick={submitFaculty}>
                    Add Faculty
                  </div>{" "}
                </>
              )}
              {showVerifyPicker && legitFaculty === "no" && (
                <>
                  <VerifyPicker
                    header="Choose which entry is the correct one from below: "
                    idKeyName="facultyID"
                    titleKeyName="facultyName"
                    verifySelectedID={legitFacultyID}
                    setVerifySelectedID={setLegitFacultyID}
                    optionsData={facultyVerifyData}
                    allowNoVote={true}
                    submitHandler={submitFacultyAndFacultyVerifyVote}
                  />
                </>
              )}
              {showInput &&
                legitFaculty === "no" &&
                (parseInt(legitFacultyID) === 0 ||
                  parseInt(legitFacultyID) === -1) && (
                  <>
                    <div className="global-info-text">
                      Since you have confirmed that none of the entries we have
                      so far are correct, please feel free to add the correct
                      details:
                    </div>
                    <TextInput
                      value={facultyName}
                      setValue={setFacultyName}
                      limit={50}
                      finalRegex={/^[a-zA-Z ]{3, 50}$/}
                      allowedRegex={/^[a-zA-Z ]*$/}
                      errorMsg={`Type something like "ARIF SHAKIL"`}
                      placeholder={`Full name of the faculty`}
                    />
                    <div className="submit-btn" onClick={submitFaculty}>
                      Add Faculty
                    </div>
                  </>
                )}
            </>
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
                  showVerify={true}
                />
              );
            })
          : null}
      </div>
    </motion.div>
  );
};

export default FacultyList;
