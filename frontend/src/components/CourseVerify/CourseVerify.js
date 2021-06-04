import "./CourseVerify.css";
import React, { useContext, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams, Redirect, useLocation, Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { getACourseVerification, postCourseVote } from "../../Queries";
import up from "../../assets/img/up.png";
import down from "../../assets/img/down.png";
import { AuthContext } from "../../contexts/AuthContext";

const CourseVerify = () => {
  const location = useLocation();
  const { isAuth } = useContext(AuthContext);
  const { departmentID, code } = useParams();
  const [nextUpdateRemainingTime, setNextUpdateRemainingTime] = useState(0);
  const queryClient = useQueryClient();
  const { addToast } = useToasts();
  const { isSuccess, isLoading, isError, error, data, isFetching } = useQuery(
    ["/api/courseverify", String(departmentID), String(code)],
    getACourseVerification,
    {
      enabled: parseInt(departmentID) !== 0,
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
  async function submitVote(courseID, voteType) {
    const data = await postCourseVote({ voteType, courseID });
    const cacheExists = queryClient.getQueryData([
      "/api/courseverify",
      String(departmentID),
      String(code),
    ]);
    if (cacheExists) {
      queryClient.setQueryData(
        ["/api/courseverify", String(departmentID), String(code)],
        (prevData) => {
          for (let i = 0; i < prevData.data.length; i++) {
            let currentCourse = prevData.data[i];
            if (currentCourse.courseID == courseID) {
              switch (data.message) {
                case "upvoteinsert":
                  currentCourse.upVoteSum = currentCourse.upVoteSum + 1;
                  break;
                case "downvoteinsert":
                  currentCourse.downVoteSum = currentCourse.downVoteSum + 1;
                  break;
                case "upvoteupdate":
                  currentCourse.upVoteSum = currentCourse.upVoteSum + 1;
                  currentCourse.downVoteSum = currentCourse.downVoteSum - 1;
                  break;
                case "downvoteupdate":
                  currentCourse.downVoteSum = currentCourse.downVoteSum + 1;
                  currentCourse.upVoteSum = currentCourse.upVoteSum - 1;
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
      console.log("refetched!");
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
    <div className="course-verify-wrapper">
      <Link style={{ textDecoration: "none" }} to="/verify">
        <div className="global-back-btn">&lArr;</div>
      </Link>
      <div className="course-verify-header">
        Next update in {Math.floor(nextUpdateRemainingTime / 60 / 60) + "h: "}
        {(Math.floor(nextUpdateRemainingTime / 60) % 60) + "m: "}
        {(nextUpdateRemainingTime % 60) + "s"}
      </div>
      <div className="faculty-verify-header">
        Showing all the entries for "{code}"
      </div>
      {isSuccess &&
        typeof data != undefined &&
        data.data
          .sort((c1, c2) => {
            return c2.upVoteSum - c1.upVoteSum;
          })
          .map((course, index) => {
            return (
              <React.Fragment key={course.courseID}>
                <div
                  className={
                    index === 0
                      ? "course-verify-list-wrapper-selected"
                      : "course-verify-list-wrapper"
                  }
                >
                  <div className="course-verify-list-vote">
                    <div className="course-verify-vote">
                      <div
                        className="icon up"
                        onClick={() => {
                          submitVote(course.courseID, 1);
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
                          submitVote(course.courseID, 0);
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
                  <div className="course-verify-code">{course.courseCode}</div>
                </div>
                {index === 0 && (
                  <div className="course-verify-info">
                    &#8593; This is the entry with the highest number of upvotes
                    and will be included in the verified database during the
                    next update cycle <b>only if it has at least 10 upvotes.</b>
                    <br />
                    If it gets more downvotes than upvotes then <b>
                      {code}
                    </b>{" "}
                    will be removed from the verified database.
                  </div>
                )}
              </React.Fragment>
            );
          })}
    </div>
  );
};

export default CourseVerify;
