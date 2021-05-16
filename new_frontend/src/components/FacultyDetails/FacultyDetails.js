import "./FacultyDetails.css";
import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import Comment from "../Comment/Comment";
import Rating from "../Rating/Rating";
import TextInput from "../TextInput/TextInput";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import server, { departments } from "../../serverDetails";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
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
const FacultyDetails = () => {
  const { id } = useParams();
  const { addToast } = useToasts();
  const pageRef = useRef(null);
  const queryClient = useQueryClient();
  const [page, setPage] = useState("");
  const [displayRating, setDisplayRating] = useState({});
  const [rating, setRating] = useState({});
  const [departmentID, setDepartmentID] = useState(0);
  const [courseID, setCourseID] = useState(0);
  const [courseCode, setCourseCode] = useState(undefined);
  const [commentPage, setCommentPage] = useState(1);
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState({});
  const { isLoading, isSuccess, isFetching, data, error, isError } = useQuery(
    ["/api/faculty", id],
    getAFaculty
  );
  const {
    mutate: ratingMutate,
    isError: isRatingError,
    isSuccess: isRatingSuccess,
    data: ratingData,
    error: ratingError,
  } = useMutation(postRating, {
    enabled: courseID != 0,
  });
  const {
    mutate: commentMutate,
    isError: isCommentPostError,
    isSuccess: isCommentPostSuccess,
    data: commentPostData,
    error: commentPostError,
  } = useMutation(postComment, {
    enabled: courseID != 0,
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
      enabled: page === "comments" && courseID != 0,
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
    enabled: departmentID != 0,
  });

  useEffect(async () => {
    setComment("");
    if (isSuccess && typeof data != "undefined") {
      updateDisplayRating(
        data.data.teaching,
        data.data.grading,
        data.data.friendliness,
        data.data.voteCount
      );
    }
    // if (page == "comments" && courseID != 0) {
    //   const res = await getUserComment({
    //     queryKey: ["/api/usercomment", id, courseID],
    //   });
    //   setComment(res.data[0].commentText);
    // }
    // if (page == "rate" && courseID != 0) {
    //   const res = await getUserRating({
    //     queryKey: ["/api/userrating", id, courseID],
    //   });
    //   setRating(res.data[0]);
    // }
  }, [isSuccess]);

  function updateDisplayRating(teaching, grading, friendliness, voteCount) {
    setDisplayRating({
      overall: ((grading + teaching + friendliness) / (3 * voteCount)).toFixed(
        1
      ),
      teaching: (teaching / voteCount).toFixed(1),
      grading: (grading / voteCount).toFixed(1),
      friendliness: (friendliness / voteCount).toFixed(1),
    });
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
      console.log("refetched!");
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

  return (
    <motion.div
      className="facultylist"
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      {isError && <div className="faculty-details-wrapper">Error....</div>}
      {isSuccess && typeof data.data != "undefined" && (
        <div className="faculty-details-wrapper">
          <div className="faculty-details-name">{data.data.facultyName}</div>
          <div className="faculty-details-initials">
            {data.data.facultyInitials}
          </div>
          <div className="faculty-details-department">
            {departments[data.data.departmentID]}
          </div>
          <div className="faculty-details-overall">
            &#9733; {displayRating.overall}
            <div
              className="faculty-details-overlay faculty-details-overall-background-overlay"
              style={{
                width: displayRating.overall * 7 + 30.2 + "%",
              }}
            ></div>
          </div>
          <div className="faculty-details-grading">
            Grading: {displayRating.grading}
            <div
              className="faculty-details-overlay"
              style={{ width: displayRating.grading * 7 + 30.2 + "%" }}
            ></div>
          </div>
          <div className="faculty-details-teaching">
            Teaching: {displayRating.teaching}
            <div
              className="faculty-details-overlay"
              style={{ width: displayRating.teaching * 7 + 30.2 + "%" }}
            ></div>
          </div>
          <div className="faculty-details-friendliness">
            Friendliness: {displayRating.friendliness}
            <div
              className="faculty-details-overlay"
              style={{ width: displayRating.friendliness * 7 + 30.2 + "%" }}
            ></div>
          </div>
        </div>
      )}
      <div className="course-wrapper">
        <select
          className="select-css"
          value={departmentID}
          onChange={(e) => {
            setDepartmentID(e.target.value);
            setCourseID(0);
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
        {departmentID != 0 && typeof courseData != "undefined" && (
          <select
            className="select-css"
            value={courseID}
            onChange={(e) => {
              setCourseCode(e.target.options[e.target.selectedIndex].text);
              setCourseID(e.target.value);
            }}
          >
            <option value="0">SELECT COURSE</option>
            {courseData.data.map((course) => {
              return (
                <option key={course.courseID} value={course.courseID}>
                  {course.courseCode}
                </option>
              );
            })}
          </select>
        )}
      </div>

      {isSuccess && (
        <div className="faculty-details-button-wrapper" ref={pageRef}>
          <div
            className={
              page == "comments"
                ? "faculty-details-comments faculty-details-active"
                : "faculty-details-comments"
            }
            onClick={() => {
              if (courseID != 0) setPage("comments");
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
              if (courseID != 0) setPage("rate");
              else addToast("Please select a course!", { appearance: "error" });
            }}
          >
            Rate
          </div>
        </div>
      )}
      {commentIsSuccess &&
        typeof commentData != "undefined" &&
        page == "comments" &&
        courseID != 0 && (
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

      {page == "rate" && courseID != 0 && (
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
