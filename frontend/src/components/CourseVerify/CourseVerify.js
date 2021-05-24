import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import "./CourseVerify.css";
import Comment from "../Comment/Comment";
import Rating from "../Rating/Rating";
import TextInput from "../TextInput/TextInput";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import server, { departments } from "../../serverDetails";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { getACourseVerification, postCourseVote } from "../../Queries";
import up from "../../assets/img/up.png";
import down from "../../assets/img/down.png";

const CourseVerify = () => {
  const { departmentID, code } = useParams();
  const queryClient = useQueryClient();
  const { addToast } = useToasts();
  const { isSuccess, isLoading, isError, error, data, isFetching } = useQuery(
    ["/api/courseverify", String(departmentID), String(code)],
    getACourseVerification,
    {
      enabled: departmentID != 0,
    }
  );

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
  return (
    <div className="course-verify-wrapper">
      {isSuccess &&
        typeof data != undefined &&
        data.data
          .sort((f1, f2) => {
            return f2.upVoteSum - f1.upVoteSum;
          })
          .map((course) => {
            return (
              <div key={course.courseID} className="course-verify-list-wrapper">
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
                <div className="course-verify-title">{course.courseTitle} </div>
                <div className="course-verify-code">{course.courseCode}</div>
              </div>
            );
          })}
    </div>
  );
};

export default CourseVerify;
