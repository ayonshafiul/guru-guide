import "./FacultyDetails.css";
import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import Comment from "../Comment/Comment";
import Rating from "../Rating/Rating";
import TextInput from "../TextInput/TextInput";
import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import server, { departments } from "../../serverDetails";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Redirect, useLocation, useParams } from "react-router-dom";
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
  const [displayRating, setDisplayRating] = useState({});
  const [rating, setRating] = useState({});
  const [departmentID, setDepartmentID] = useLocalStorage("departmentID", "0");
  const [courseID, setCourseID] = useState("0");
  const [courseCode, setCourseCode] = useState("");
  const [commentPage, setCommentPage] = useState(1);
  const [comment, setComment] = useState("");
  const [currentFaculty, setCurrentFaculty] = useState({});
  const {
    mutate: ratingMutate,
    isError: isRatingError,
    isSuccess: isRatingSuccess,
    data: ratingData,
    error: ratingError,
  } = useMutation(postRating, {
    enabled: parseInt(courseID) !== 0,
  });
  const {
    mutate: commentMutate,
    isError: isCommentPostError,
    isSuccess: isCommentPostSuccess,
    data: commentPostData,
    error: commentPostError,
  } = useMutation(postComment, {
    enabled: parseInt(courseID) !== 0,
  });

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

  useEffect(async () => {
    const data = await getAFaculty({ queryKey: ["/api/faculty", id] });
    if (typeof data.data !== "undefined") {
      const {
        facultyName,
        facultyInitials,
        departmentID,
        teaching,
        grading,
        friendliness,
        voteCount,
      } = data.data;
      if (data.success) {
        setCurrentFaculty({
          facultyName,
          facultyInitials,
          departmentID,
        });
        updateDisplayRating(teaching, grading, friendliness, voteCount);
      }
    }
  }, []);

  function updateDisplayRating(teaching, grading, friendliness, voteCount) {
    if (voteCount === 0) {
      setDisplayRating({
        overall: 0,
        grading: 0,
        teaching: 0,
        friendliness: 0,
      });
    } else {
      setDisplayRating({
        overall: (
          (grading + teaching + friendliness) /
          (3 * voteCount)
        ).toFixed(1),
        teaching: (teaching / voteCount).toFixed(1),
        grading: (grading / voteCount).toFixed(1),
        friendliness: (friendliness / voteCount).toFixed(1),
      });
    }
  }
  function changeRating(type, buttonNo) {
    setRating({
      ...rating,
      [type]: buttonNo,
    });
  }

  async function submitComment() {
    await commentMutate({ comment, facultyID: id, courseID });

    if (isCommentPostSuccess) {
      setComment("");
      addToast("Thanks for the feedback");
    }
  }

  async function submitRating() {
    if (rating["teaching"] && rating["friendliness"] && rating["grading"]) {
      await ratingMutate({ rating, facultyID: id, courseID });
      addToast("Thanks for the feedback!");
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

  function calculateStars() {
    let str = [];
    for (let i = 0; i < parseInt(displayRating.overall); i++) {
      str.push(<>&#9733;</>);
    }
    return str;
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
      <div className="faculty-details-wrapper">
        <div className="faculty-details-name">{currentFaculty.facultyName}</div>
        <div className="faculty-details-initials">
          {currentFaculty.facultyInitials}
        </div>
        <div className="faculty-details-department">
          {departments[currentFaculty.departmentID]}
        </div>
        <div className="faculty-details-overall">
          <span className="faculty-details-text-bg  yellow-stars">
            {calculateStars()}
          </span>
          <div
            className="faculty-details-overlay faculty-details-overall-background-overlay"
            style={{
              width: displayRating.overall * 10 + 0.5 + "%",
            }}
          ></div>
        </div>

        <div className="faculty-details-teaching">
          <span className="faculty-details-text-bg">
            Teaching: {displayRating.teaching}
          </span>
          <div
            className="faculty-details-overlay overlay-c1"
            style={{ width: displayRating.teaching * 10 + 0.5 + "%" }}
          ></div>
        </div>
        <div className="faculty-details-grading">
          <span className="faculty-details-text-bg">
            Grading: {displayRating.grading}
          </span>
          <div
            className="faculty-details-overlay overlay-c3"
            style={{ width: displayRating.grading * 10 + 0.5 + "%" }}
          ></div>
        </div>
        <div className="faculty-details-friendliness">
          <span className="faculty-details-text-bg">
            Friendliness: {displayRating.friendliness}
          </span>
          <div
            className="faculty-details-overlay overlay-c2"
            style={{ width: displayRating.friendliness * 10 + 0.5 + "%" }}
          ></div>
        </div>
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
        {parseInt(departmentID) !== 0 && typeof courseData != "undefined" && (
          <select
            className="select-css"
            value={courseID}
            onChange={(e) => {
              setCourseCode(e.target.options[e.target.selectedIndex].text);
              setCourseID(String(e.target.value));
            }}
          >
            <option value="0">SELECT COURSE</option>
            {courseData.data.map((course) => {
              return (
                <option key={course.courseID} value={String(course.courseID)}>
                  {course.courseCode}
                </option>
              );
            })}
          </select>
        )}
      </div>

      <div className="faculty-details-button-wrapper" ref={pageRef}>
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
        >
          Comments
        </div>
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
      </div>
      {commentIsSuccess &&
        typeof commentData != "undefined" &&
        page == "comments" &&
        parseInt(courseID) !== 0 && (
          <>
            {commentPage == 1 && (
              <div className="wrapper-general">
                <TextInput
                  value={comment}
                  type={"textarea"}
                  setValue={setComment}
                  limit={300}
                  finalRegex={/^[a-zA-Z ,.()']{1,500}$/}
                  allowedRegex={/^[a-zA-Z ,.()']*$/}
                  errorMsg={`Uh oh you shouldn't have typed that!.`}
                  placeholder={`Type a cool comment :)`}
                />
                <div className="submit-comment-btn" onClick={submitComment}>
                  Post comment for {courseCode}
                </div>
              </div>
            )}
            {courseCode && (
              <div className="info-header">
                Showing comments for: {courseCode}{" "}
              </div>
            )}
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
              {commentData.data.length > 0 && (
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
          </>
        )}

      {page == "rate" && parseInt(courseID) !== 0 && (
        <>
          {courseCode && (
            <div className="info-header">
              You are giving feedback for {courseCode}.{" "}
            </div>
          )}
          <Rating type="teaching" rating={rating} changeRating={changeRating} />
          <Rating type="grading" rating={rating} changeRating={changeRating} />
          <Rating
            type="friendliness"
            rating={rating}
            changeRating={changeRating}
          />
          <div
            className={
              rating["teaching"] && rating["friendliness"] && rating["grading"]
                ? "submit-rating"
                : "submit-rating-disabled"
            }
            onClick={submitRating}
          >
            Rate
          </div>
        </>
      )}
    </motion.div>
  );
};

export default FacultyDetails;
