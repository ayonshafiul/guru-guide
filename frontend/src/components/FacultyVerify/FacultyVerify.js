import "./FacultyVerify.css";
import React, { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams, Redirect, useLocation, Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { getAFacultyVerification, postFacultyVote } from "../../Queries";
import up from "../../assets/img/up.png";
import down from "../../assets/img/down.png";
import { AuthContext } from "../../contexts/AuthContext";

const FacultyVerify = () => {
  const location = useLocation();
  const { isAuth } = useContext(AuthContext);
  const { departmentID, initials } = useParams();
  const [nextUpdateRemainingTime, setNextUpdateRemainingTime] = useState(0);
  const queryClient = useQueryClient();
  const { addToast } = useToasts();
  const { isSuccess, isLoading, isError, error, data, isFetching } = useQuery(
    ["/api/facultyverify", String(departmentID), String(initials)],
    getAFacultyVerification,
    {
      enabled: departmentID !== 0,
    }
  );
  let intervalID = 0;
  const today = new Date();
  useEffect(() => {
    intervalID = setInterval(() => {
      let remaining =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          3,
          0,
          0
        ) - Date.now();
      if (remaining < 0) {
        remaining += 86400000; // add the next day in milliseconds
      }
      setNextUpdateRemainingTime(Math.floor(remaining / 1000));
    }, 1000);

    return function cleanup() {
      clearInterval(intervalID);
    };
  }, []);
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
                  currentFaculty.upVoteSum = currentFaculty.upVoteSum + 1;
                  break;
                case "downvoteinsert":
                  currentFaculty.downVoteSum = currentFaculty.downVoteSum + 1;
                  break;
                case "upvoteupdate":
                  currentFaculty.upVoteSum = currentFaculty.upVoteSum + 1;
                  currentFaculty.downVoteSum = currentFaculty.downVoteSum - 1;
                  break;
                case "downvoteupdate":
                  currentFaculty.downVoteSum = currentFaculty.downVoteSum + 1;
                  currentFaculty.upVoteSum = currentFaculty.upVoteSum - 1;
                  break;
                case "noupdate":
                  addToast("Thank you. We got your vote!");
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
          addToast("Thanks for the thumbs up!");
          break;
        case "downvoteinsert":
          addToast("Thanks for the thumbs down!");
          break;
        case "upvoteupdate":
          addToast("Thanks for the thumbs up!");
          break;
        case "downvoteupdate":
          addToast("Thanks for the thumbs down!");

          break;
        case "noupdate":
          addToast("Thank you. We got your vote!");
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
    <div className="faculty-verify-wrapper">
      <Link style={{ textDecoration: "none" }} to="/verify">
        <div className="global-back-btn">&lArr;</div>
      </Link>
      <div className="faculty-verify-header">
        Next update in {Math.floor(nextUpdateRemainingTime / 60 / 60) + "h: "}
        {(Math.floor(nextUpdateRemainingTime / 60) % 60) + "m: "}
        {(nextUpdateRemainingTime % 60) + "s"}
        <br />
        After this waiting time if {initials} gets at least 3 upvotes in one of
        its entries it will be automatically added in the faculty list
      </div>
      <div className="faculty-verify-header">
        Showing all the entries for "{initials}"
      </div>
      {isSuccess &&
        typeof data != undefined &&
        data.data
          .sort((f1, f2) => {
            return f2.upVoteSum - f1.upVoteSum;
          })
          .map((faculty, index) => {
            return (
              <React.Fragment key={faculty.facultyID}>
                <div
                  className={
                    index === 0
                      ? "faculty-verify-list-wrapper-selected"
                      : "faculty-verify-list-wrapper"
                  }
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
                {index === 0 && (
                  <div className="faculty-verify-info">
                    &#8593; This is the entry with the highest number of upvotes
                    and will be included in the verified database during the
                    next update cycle <b>only if it has at least 3 upvotes.</b>
                    <br />
                    If it gets more downvotes than upvotes then{" "}
                    <b>{initials}</b> will be removed from the verified
                    database.
                  </div>
                )}
              </React.Fragment>
            );
          })}
    </div>
  );
};

export default FacultyVerify;
