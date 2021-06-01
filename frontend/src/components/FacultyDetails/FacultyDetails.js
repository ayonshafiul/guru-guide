import "./FacultyDetails.css";
import { motion } from "framer-motion";
import pageAnimationVariant, {
  slideAnimationVariant,
} from "../../AnimationData";
import Comment from "../Comment/Comment";
import Rating from "../Rating/Rating";
import TextInput from "../TextInput/TextInput";
import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import server, { departments } from "../../serverDetails";
import { useQuery, useQueryClient } from "react-query";
import { Redirect, useLocation, useParams, Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { AuthContext } from "../../contexts/AuthContext";
import {
  getAFaculty,
  getComment,
  postRating,
  postCommentVote,
  getCourse,
  postComment,
  getUserComment,
  getUserRating,
  getRatingForACourse,
} from "../../Queries";
import useLocalStorage from "../../useLocalStorage";
const FacultyDetails = (props) => {
  const location = useLocation();
  const { isAuth } = useContext(AuthContext);
  const { id } = useParams();
  const { addToast } = useToasts();
  const pageRef = useRef(null);
  const queryClient = useQueryClient();
  const [page, setPage] = useState("");
  const [rating, setRating] = useState({});
  const [departmentID, setDepartmentID] = useLocalStorage("departmentID", "0");
  const [courseID, setCourseID] = useState("0");
  const [courseCode, setCourseCode] = useState("");
  const [commentPage, setCommentPage] = useState(1);
  const [comment, setComment] = useState("");
  const allowedRegex = /^[a-zA-Z0-9 ,.()?:-_'"!]*$/;
  const finalRegex = /^[a-zA-Z0-9 ,.()?:-_'"!]{2,300}$/;

  const {
    isLoading: commentIsLoading,
    isSuccess: commentIsSuccess,
    data: commentData,
    error: commentError,
    isError: commentIsError,
    refetch: commentRefetch,
    remove: commentRemove,
  } = useQuery(
    ["/api/comment", String(id), String(courseID), String(commentPage)],
    getComment,
    {
      enabled: page === "comments" && parseInt(courseID) !== 0,
      keepPreviousData: true,
    }
  );

  const {
    isLoading: courseIsLoading,
    isSuccess: courseIsSuccess,
    isFetching: courseIsFetching,
    data: courseData,
    error: courseError,
    isError: courseIsError,
  } = useQuery(["/api/course", departmentID], getCourse, {
    enabled: parseInt(departmentID) !== 0,
  });

  const {
    isLoading: facultyCourseRatingIsLoading,
    isSuccess: facultyCourseRatingIsSuccess,
    isFetching: facultyCourseRatingIsFetching,
    data: facultyCourseRatingData,
    error: facultyCourseRatingError,
    isError: facultyCourseRatingIsError,
    refetch: facultyCourseRatingRefetch,
  } = useQuery(
    ["/api/facultyrating", String(id), String(courseID)],
    getRatingForACourse,
    {
      enabled: parseInt(departmentID) !== 0 && parseInt(courseID) !== 0,
    }
  );

  const {
    isLoading: facultyLoading,
    isSuccess: facultyIsSuccess,
    isFetching: facultyIsFetching,
    data: facultyData,
    error: facultyError,
    isError: facultyIsError,
    refetch: facultyRefetch,
  } = useQuery(["/api/faculty", String(id)], getAFaculty);

  function changeRating(type, buttonNo) {
    setRating({
      ...rating,
      [type]: buttonNo,
    });
  }

  async function submitComment() {
    if (comment.match(finalRegex)) {
      const data = await postComment({ comment, facultyID: id, courseID });
      if (typeof data !== "undefined") {
        if (data.success) {
          setComment("");
          commentRefetch();
          addToast("Thanks for the feedback");
        } else {
          addToast("");
        }
      }
    } else {
      addToast("Please type at least 2 or more characters!");
    }
  }

  async function submitRating() {
    if (rating["teaching"] && rating["friendliness"] && rating["grading"]) {
      const data = await postRating({ rating, facultyID: id, courseID });
      if (typeof data !== "undefined") {
        setRating({});
        addToast("Thanks for the feedback!");
        facultyRefetch();
        facultyCourseRatingRefetch();
      }
    }
  }

  async function submitCommentVote(commentID, voteType) {
    const res = await axios.post(
      server.url + "/api/commentVote/" + commentID,
      { voteType },
      { withCredentials: true }
    );
    const resData = res.data;
    const cacheExists = queryClient.getQueryData([
      "/api/comment",
      String(id),
      String(courseID),
      String(commentPage),
    ]);
    if (cacheExists) {
      queryClient.setQueryData(
        ["/api/comment", String(id), String(courseID), String(commentPage)],
        (prevData) => {
          for (let i = 0; i < prevData.data.length; i++) {
            let currentComment = prevData.data[i];
            if (currentComment.commentID == commentID) {
              switch (resData.message) {
                case "upvoteinsert":
                  currentComment.upVoteSum = currentComment.upVoteSum + 1;
                  break;
                case "downvoteinsert":
                  currentComment.downVoteSum = currentComment.downVoteSum + 1;
                  break;
                case "upvoteupdate":
                  currentComment.upVoteSum = currentComment.upVoteSum + 1;
                  currentComment.downVoteSum = currentComment.downVoteSum - 1;
                  break;
                case "downvoteupdate":
                  currentComment.downVoteSum = currentComment.downVoteSum + 1;
                  currentComment.upVoteSum = currentComment.upVoteSum - 1;
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
      switch (resData.message) {
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
    <motion.div
      className="facultylist"
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      <Link style={{ textDecoration: "none" }} to="/faculty">
        <div className="global-back-btn">&lArr;</div>
      </Link>
      <div className="faculty-details-wrapper">
        {facultyIsSuccess && typeof facultyData.data !== "undefined"
          ? showFacultyDetailsSection(
              facultyData.data.facultyInitials,
              facultyData.data.facultyName,
              facultyData.data.departmentID
            )
          : ""}
        {facultyIsSuccess && typeof facultyData.data !== "undefined"
          ? showFacultyRatingSection(
              "Overall rating",
              facultyData.data.teaching,
              facultyData.data.grading,
              facultyData.data.friendliness,
              facultyData.data.voteCount
            )
          : ""}
      </div>

      <div className="course-wrapper">
        <select
          className="select-css"
          value={departmentID}
          onChange={(e) => {
            setDepartmentID(String(e.target.value));
            setCourseID("0");
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
        {parseInt(departmentID) !== 0 && typeof courseData !== "undefined" && (
          <select
            className="select-css"
            value={courseID}
            onChange={(e) => {
              setCourseCode(e.target.options[e.target.selectedIndex].text);
              setCourseID(String(e.target.value));
            }}
          >
            <option value="0">SELECT COURSE</option>
            {courseData.data
              .sort((c1, c2) => {
                return c1.courseCode > c2.courseCode ? 1 : -1;
              })
              .map((course) => {
                return (
                  <option key={course.courseID} value={String(course.courseID)}>
                    {course.courseCode}
                  </option>
                );
              })}
          </select>
        )}
      </div>
      {facultyCourseRatingIsSuccess &&
      typeof facultyCourseRatingData.data !== "undefined"
        ? showFacultyCourseRatingSection(
            "Rating for " + courseCode,
            courseCode,
            facultyCourseRatingData.data.teaching,
            facultyCourseRatingData.data.grading,
            facultyCourseRatingData.data.friendliness,
            facultyCourseRatingData.data.voteCount
          )
        : ""}

      <div className="faculty-details-button-wrapper">
        <div
          className={
            page == "rate"
              ? "faculty-details-rate faculty-details-active"
              : "faculty-details-rate"
          }
          onClick={() => {
            if (parseInt(courseID) !== 0) setPage("rate");
            else addToast("Please select a course!", { appearance: "error" });
          }}
        >
          Rate
        </div>

        {page == "rate" && parseInt(courseID) !== 0 && (
          <motion.div
            className="facultylist"
            variants={slideAnimationVariant}
            initial="initial"
            animate="animate"
          >
            {courseCode && (
              <div className="info-header">
                You are giving feedback for {courseCode}.{" "}
              </div>
            )}
            <Rating
              type="teaching"
              rating={rating}
              changeRating={changeRating}
            />
            <Rating
              type="grading"
              rating={rating}
              changeRating={changeRating}
            />
            <Rating
              type="friendliness"
              rating={rating}
              changeRating={changeRating}
            />
            <div
              className={
                rating["teaching"] &&
                rating["friendliness"] &&
                rating["grading"]
                  ? "submit-rating"
                  : "submit-rating-disabled"
              }
              onClick={submitRating}
            >
              Rate
            </div>
          </motion.div>
        )}

        <div
          className={
            page == "comments"
              ? "faculty-details-comments faculty-details-active"
              : "faculty-details-comments"
          }
          onClick={() => {
            if (parseInt(courseID) !== 0) setPage("comments");
            else addToast("Please select a course!", { appearance: "error" });
          }}
          ref={pageRef}
        >
          Comments
        </div>
        {commentIsSuccess &&
          typeof commentData != "undefined" &&
          page == "comments" &&
          parseInt(courseID) !== 0 && (
            <motion.div
              className="facultylist"
              variants={slideAnimationVariant}
              initial="initial"
              animate="animate"
            >
              {commentPage == 1 && (
                <div className="wrapper-general">
                  <TextInput
                    value={comment}
                    type={"textarea"}
                    setValue={setComment}
                    limit={300}
                    finalRegex={finalRegex}
                    allowedRegex={allowedRegex}
                    lowercase={true}
                    errorMsg={"Please type at leat 2 or more characters!"}
                    placeholder={`Type a short comment. :)`}
                  />
                  <div className="submit-comment-btn" onClick={submitComment}>
                    Post comment for {courseCode}
                  </div>
                </div>
              )}
              {courseCode && commentData.data.length > 0 ? (
                <div className="info-header">
                  Showing comments for: {courseCode}{" "}
                </div>
              ) : null}
              {commentData.data.map((comment) => {
                return (
                  <Comment
                    key={comment.commentID}
                    comment={comment}
                    submitCommentVote={submitCommentVote}
                  />
                );
              })}
              <div className="comment-page-buttons">
                {commentPage > 1 && (
                  <div
                    className="comment-prev-btn"
                    onClick={() => {
                      pageRef.current.scrollIntoView({ behavior: "smooth" });
                      setCommentPage((prevPage) => prevPage - 1);
                    }}
                  >
                    {`<< Prev`}
                  </div>
                )}
                {commentData.data.length >= 9 && (
                  <div
                    className="comment-next-btn"
                    onClick={() => {
                      pageRef.current.scrollIntoView({ behavior: "smooth" });
                      setCommentPage((prevPage) => prevPage + 1);
                    }}
                  >
                    {`Next >>`}
                  </div>
                )}
              </div>
            </motion.div>
          )}
      </div>
    </motion.div>
  );
};
function showFacultyDetailsSection(facultyInitials, facultyName, departmentID) {
  return (
    <>
      <div className="faculty-details-name">{facultyName}</div>
      <div className="faculty-details-initials">{facultyInitials}</div>
      <div className="faculty-details-department">
        {departments[departmentID]}
      </div>
    </>
  );
}

function showFacultyRatingSection(
  title,
  teaching,
  grading,
  friendliness,
  voteCount
) {
  let overall = 0;
  if (parseInt(voteCount) !== 0) {
    overall = ((teaching + grading + friendliness) / (3 * voteCount)).toFixed(
      1
    );
    grading = (grading / voteCount).toFixed(1);
    friendliness = (friendliness / voteCount).toFixed(1);
    teaching = (teaching / voteCount).toFixed(1);
  } else {
    teaching = 0;
    friendliness = 0;
    grading = 0;
  }

  return (
    <>
      <div className="faculty-details-info">{title}</div>
      <div className="faculty-details-overall">
        <span className="faculty-details-text-bg  yellow-stars">
          {calculateStars(overall)}
        </span>
        <div
          className="faculty-details-overlay faculty-details-overall-background-overlay"
          style={{
            width: overall * 10 + 0.5 + "%",
          }}
        ></div>
      </div>
      <div className="faculty-details-teaching">
        <span className="faculty-details-text-bg">Teaching: {teaching}</span>
        <div
          className="faculty-details-overlay overlay-c1"
          style={{ width: teaching * 10 + 0.5 + "%" }}
        ></div>
      </div>
      <div className="faculty-details-grading">
        <span className="faculty-details-text-bg">Grading: {grading}</span>
        <div
          className="faculty-details-overlay overlay-c3"
          style={{ width: grading * 10 + 0.5 + "%" }}
        ></div>
      </div>
      <div className="faculty-details-friendliness">
        <span className="faculty-details-text-bg">
          Friendliness: {friendliness}
        </span>
        <div
          className="faculty-details-overlay overlay-c2"
          style={{ width: friendliness * 10 + 0.5 + "%" }}
        ></div>
      </div>
    </>
  );
}

function calculateStars(overall) {
  let str = [];
  for (let i = 0; i < parseInt(overall); i++) {
    str.push(<>&#9733;</>);
  }
  return str;
}

function showFacultyCourseRatingSection(
  title,
  courseCode,
  teaching,
  grading,
  friendliness,
  voteCount
) {
  <div className="faculty-details-info">{title}</div>;
  let avgGrading = (grading / voteCount).toFixed(1);
  let avgFriendliness = (friendliness / voteCount).toFixed(1);
  let avgTeaching = (teaching / voteCount).toFixed(1);
  return (
    <motion.div
      className="facultylist"
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      <div className="fd-rating-wrapper">
        <div className="fd-average-rating">
          <span className="fd-red">
            {((teaching + grading + friendliness) / (3 * voteCount)).toFixed(1)}
          </span>
          <span>&#9733;</span>
          {" " + courseCode}
        </div>
        <div className="fd-faculty-vote-count">
          T: <span className="fd-red">{avgTeaching}</span> G:{" "}
          <span className="fd-red">{avgGrading}</span> F:{" "}
          <span className="fd-red">{avgFriendliness}</span> <br />
          {voteCount === 0.1 ? "0" : voteCount} vote(s)
        </div>
        <div className="fd-rating-bar-wrapper">
          <div
            className="fd-rating-bar"
            style={{ height: avgTeaching * 2.5 + 2 }}
          ></div>
          <div
            className="fd-rating-bar"
            style={{ height: avgGrading * 2.5 + 2 }}
          ></div>
          <div
            className="fd-rating-bar"
            style={{ height: avgFriendliness * 2.5 + 2 }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
}

export default FacultyDetails;
