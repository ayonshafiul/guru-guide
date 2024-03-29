import "./CourseDetails.css";
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
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Redirect, useLocation, useParams, Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { AuthContext } from "../../contexts/AuthContext";
import {
  getCourseComment,
  postCourseRating,
  getACourse,
  postCourseComment,
  getACourseByUID,
} from "../../Queries";
const CourseDetails = () => {
  const location = useLocation();
  const { isAuth } = useContext(AuthContext);
  const { id } = useParams();
  const [cid, setCid] = useState(0);
  const { addToast } = useToasts();
  const pageRef = useRef(null);
  const queryClient = useQueryClient();
  const [page, setPage] = useState("");
  const [rating, setRating] = useState({});
  const [commentPage, setCommentPage] = useState(1);
  const [comment, setComment] = useState("");

  const {
    isSuccess: commentIsSuccess,
    data: commentData,
    refetch: commentRefetch,
  } = useQuery(
    ["/api/coursecomment", String(cid), String(commentPage)],
    getCourseComment,
    {
      enabled: page === "comments",
      keepPreviousData: true,
    }
  );

  const {
    isSuccess: courseIsSuccess,
    data: courseData,
    refetch: courseRefetch,
  } = useQuery(["/api/coursedetails", String(id)], getACourseByUID);

  useEffect(async () => {
    const data = await getACourseByUID({
      queryKey: ["/api/coursedetails", String(id)],
    });
    if (data.success) {
      setCid(data.data.courseID);
    }
  }, []);

  function changeRating(type, buttonNo) {
    setRating({
      ...rating,
      [type]: buttonNo,
    });
  }
  const allowedRegex = /^[a-zA-Z0-9 ,.()?:-_'"!]*$/;
  const finalRegex = /^[a-zA-Z0-9 ,.()?:-_'"!]{2,500}$/;
  async function submitCourseComment() {
    if (comment.match(finalRegex)) {
      const data = await postCourseComment({ comment, courseID: cid });
      if (typeof data !== "undefined") {
        if (data.success) {
          setComment("");
          commentRefetch();
          addToast("Thanks for the feedback");
        } else {
          addToast("Error posting your comment!");
        }
      }
    } else {
      addToast("Please type at leat 2 or more characters!");
    }
  }

  async function submitCourseRating() {
    if (rating["difficulty"]) {
      const data = await postCourseRating({ rating, courseID: cid });
      if (typeof data !== "undefined" && data.success) {
        setRating({});
        addToast("Thanks for the feedback!");
        courseRefetch();
      } else {
        addToast("An error occured!");
      }
    }
  }

  async function submitCommentVote(commentID, voteType) {
    const res = await axios.post(
      server.url + "/api/coursecommentvote/" + commentID,
      { voteType },
      { withCredentials: true }
    );
    const resData = res.data;
    const cacheExists = queryClient.getQueryData([
      "/api/coursecomment",
      String(cid),
      String(commentPage),
    ]);
    if (cacheExists) {
      queryClient.setQueryData(
        ["/api/coursecomment", String(cid), String(commentPage)],
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
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      <Link style={{ textDecoration: "none" }} to="/course">
        <div className="global-back-btn">&lArr;</div>
      </Link>
      <div className="course-details-wrapper">
        {courseIsSuccess && typeof courseData.data !== "undefined"
          ? showCourseDetailsSection(
              courseData.data.courseCode,
              courseData.data.courseTitle,
              courseData.data.departmentID
            )
          : ""}
        {courseIsSuccess && typeof courseData.data !== "undefined"
          ? showCourseRatingSection(
              "Overall rating",
              courseData.data.difficulty,
              courseData.data.rateCount
            )
          : ""}
      </div>
      <div className="course-details-button-wrapper">
        <div
          className={
            page == "rate"
              ? "course-details-rate course-details-active"
              : "course-details-rate"
          }
          onClick={() => {
            setPage("rate");
          }}
        >
          Rate
        </div>

        {page == "rate" && (
          <motion.div
            variants={slideAnimationVariant}
            initial="initial"
            animate="animate"
          >
            <Rating
              type="difficulty"
              rating={rating}
              changeRating={changeRating}
              reversed={true}
            />
            <div
              className={
                rating["difficulty"]
                  ? "submit-rating"
                  : "submit-rating-disabled"
              }
              onClick={submitCourseRating}
            >
              Rate
            </div>
          </motion.div>
        )}

        <div
          className={
            page == "comments"
              ? "course-details-comments course-details-active"
              : "course-details-comments"
          }
          onClick={() => {
            setPage("comments");
          }}
          ref={pageRef}
        >
          Comments
        </div>
        {commentIsSuccess &&
          typeof commentData !== "undefined" &&
          page == "comments" && (
            <motion.div
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
                    limit={500}
                    finalRegex={finalRegex}
                    allowedRegex={allowedRegex}
                    lowercase={true}
                    errorMsg={"Please type at leat 2 or more characters!"}
                    placeholder={`Type a short comment. :)`}
                  />
                  <div
                    className="submit-comment-btn"
                    onClick={submitCourseComment}
                  >
                    Post comment
                  </div>
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
                {commentData.data.length >= 10 && (
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
function showCourseDetailsSection(courseCode, courseTitle, departmentID) {
  return (
    <>
      <div className="course-details-title">{courseTitle}</div>
      <div className="course-details-code">{courseCode}</div>
      <div className="course-details-department">
        {departments[departmentID]}
      </div>
    </>
  );
}

export function showCourseRatingSection(
  title,
  difficulty,
  rateCount,
  showCourseCount
) {
  let overall = 0;
  if (parseInt(rateCount) !== 0) {
    difficulty = (difficulty / rateCount).toFixed(1);
  } else {
    difficulty = 0;
  }

  return (
    <>
      <div className="course-details-info">{title}</div>
      <div className="course-details-difficulty">
        <span className="course-details-text-bg">
          Difficulty: {difficulty} &#9762;
        </span>
        <span className="course-details-text-bg">
          {rateCount} {showCourseCount ? "course(s)" : "vote(s)"}
        </span>
        <div
          className={
            difficulty <= 4
              ? "course-details-overlay bg-green"
              : difficulty <= 7
              ? "course-details-overlay bg-yellow"
              : "course-details-overlay bg-red"
          }
          style={{ width: difficulty * 10 + 0.5 + "%" }}
        ></div>
      </div>
    </>
  );
}

export default CourseDetails;
