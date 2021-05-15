import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import "./FacultyVerify.css";
import Comment from "../Comment/Comment";
import Rating from "../Rating/Rating";
import TextInput from "../TextInput/TextInput";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import server, { departments } from "../../serverDetails";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { getAFacultyVerification } from "../../Queries";
import up from "../../assets/img/up.png";
import down from "../../assets/img/down.png";

const FacultyVerify = () => {
  const { departmentID, initials } = useParams();
  const { isSuccess, isLoading, isError, error, data, isFetching } = useQuery(
    ["/api/facultyverify", String(departmentID), String(initials)],
    getAFacultyVerification,
    {
      enabled: departmentID != 0,
    }
  );
  return (
    <div className="faculty-verify-wrapper">
      {isSuccess &&
        typeof data != undefined &&
        data.data.map((faculty) => {
          return (
            <div className="faculty-verify-list-wrapper">
              <div className="faculty-verify-list-vote">
                <div className="faculty-verify-vote">
                  <div className="icon up" onClick={() => {}}>
                    <img className="icon-img" src={up} />
                  </div>
                  <div className="faculty-verify-vote-count">
                    {faculty.upVoteSum}
                  </div>
                </div>
                <div className="faculty-verify-vote">
                  <div className="icon down" onClick={() => {}}>
                    <img className="icon-img" src={down} />
                  </div>
                  <div className="faculty-verify-vote-count">
                    {faculty.downVoteSum}
                  </div>
                </div>
              </div>
              <div className="faculty-verify-name">{faculty.facultyName} </div>
              <div className="faculty-verify-initials">
                {faculty.facultyInitials}{" "}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default FacultyVerify;
