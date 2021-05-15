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
import { getACourseVerification } from "../../Queries";
import up from "../../assets/img/up.png";
import down from "../../assets/img/down.png";

const CourseVerify = () => {
  const { departmentID, code } = useParams();
  const { isSuccess, isLoading, isError, error, data, isFetching } = useQuery(
    ["/api/courseverify", String(departmentID), String(code)],
    getACourseVerification,
    {
      enabled: departmentID != 0,
    }
  );
  return (
    <div className="course-verify-wrapper">
      {isSuccess &&
        typeof data != undefined &&
        data.data.map((course) => {
          return (
            <div className="course-verify-list-wrapper">
              <div className="course-verify-list-vote">
                <div className="course-verify-vote">
                  <div className="icon up" onClick={() => {}}>
                    <img className="icon-img" src={up} />
                  </div>
                  <div className="course-verify-vote-count">
                    {course.upVoteSum}
                  </div>
                </div>
                <div className="course-verify-vote">
                  <div className="icon down" onClick={() => {}}>
                    <img className="icon-img" src={down} />
                  </div>
                  <div className="course-verify-vote-count">
                    {course.downVoteSum}
                  </div>
                </div>
              </div>
              <div className="course-verify-title">{course.courseTitle} </div>
              <div className="course-verify-code">
                {course.courseCode}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CourseVerify;
