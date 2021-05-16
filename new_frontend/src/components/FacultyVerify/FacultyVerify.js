import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import "./FacultyVerify.css";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import server, { departments } from "../../serverDetails";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { getAFacultyVerification, postFacultyVote } from "../../Queries";
import up from "../../assets/img/up.png";
import down from "../../assets/img/down.png";

const FacultyVerify = () => {
  const { departmentID, initials } = useParams();
  const queryClient = useQueryClient();
  const { addToast } = useToasts();
  const { isSuccess, isLoading, isError, error, data, isFetching } = useQuery(
    ["/api/facultyverify", String(departmentID), String(initials)],
    getAFacultyVerification,
    {
      enabled: departmentID != 0,
    }
  );
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
    <div className="faculty-verify-wrapper">
      {isSuccess &&
        typeof data != undefined &&
        data.data
          .sort((f1, f2) => {
            return f2.upVoteSum - f1.upVoteSum;
          })
          .map((faculty) => {
            return (
              <div
                key={faculty.facultyID}
                className="faculty-verify-list-wrapper"
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
            );
          })}
    </div>
  );
};

export default FacultyVerify;
