import "./FacultyDetails.css";
import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import FacultyListItem from "../FacultyListItem/FacultyListItem";
import Comment from "../Comment/Comment";
import Rating from "../Rating/Rating";
import { useState, useRef } from "react";
import axios from "axios";
import server from "../../serverDetails";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import {
  getAFaculty,
  getComment,
  postRating,
  postCommentVote,
} from "../../Queries";

const FacultyDetails = () => {
  const { id } = useParams();
  const pageRef = useRef(null);
  const queryClient = useQueryClient();
  const [page, setPage] = useState("");
  const [rating, setRating] = useState({});
  const [courseID, setCourseID] = useState(1);
  const [commentPage, setCommentPage] = useState(1);
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
  } = useMutation(postRating);

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
      enabled: page === "comments",
      keepPreviousData: true,
    }
  );

  function changeRating(type, buttonNo) {
    setRating({
      ...rating,
      [type]: buttonNo,
    });
  }

  async function submitRating() {
    if (rating["teaching"] && rating["friendliness"] && rating["grading"]) {
      await ratingMutate({ rating, facultyID: id });
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
                  break;
              }
            }
          }
          return prevData;
        }
      );
    } else {
      console.log("refetched!");
      commentRefetch();
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
            {data.data.departmentID}
          </div>
          <div className="faculty-details-overall">
            &#9733;{" "}
            {(
              (data.data.grading +
                data.data.teaching +
                data.data.friendliness) /
              3
            ).toFixed(1)}
            <div
              className="faculty-details-overlay faculty-details-overall-background-overlay"
              style={{
                width:
                  (
                    (data.data.grading +
                      data.data.teaching +
                      data.data.friendliness) /
                    3
                  ).toFixed(1) *
                    7 +
                  31 +
                  "%",
              }}
            ></div>
          </div>
          <div className="faculty-details-grading">
            Grading: {data.data.grading}
            <div
              className="faculty-details-overlay"
              style={{ width: data.data.grading * 7 + 31 + "%" }}
            ></div>
          </div>
          <div className="faculty-details-teaching">
            Teaching: {data.data.teaching}
            <div
              className="faculty-details-overlay"
              style={{ width: data.data.teaching * 7 + 31 + "%" }}
            ></div>
          </div>
          <div className="faculty-details-friendliness">
            Friendliness: {data.data.friendliness}
            <div
              className="faculty-details-overlay"
              style={{ width: data.data.friendliness * 7 + 31 + "%" }}
            ></div>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="faculty-details-button-wrapper" ref={pageRef}>
          <div
            className={
              page == "comments"
                ? "faculty-details-comments faculty-details-active"
                : "faculty-details-comments"
            }
            onClick={() => setPage("comments")}
          >
            Comments
          </div>
          <div
            className={
              page == "rate"
                ? "faculty-details-rate faculty-details-active"
                : "faculty-details-rate"
            }
            onClick={() => setPage("rate")}
          >
            Rate
          </div>
        </div>
      )}
      {commentIsSuccess &&
        typeof commentData.data != "undefined" &&
        page == "comments" && (
          <>
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

      {page == "rate" && (
        <>
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
          {isRatingSuccess && <div>Successfully updated!</div>}
        </>
      )}
    </motion.div>
  );
};

export default FacultyDetails;
