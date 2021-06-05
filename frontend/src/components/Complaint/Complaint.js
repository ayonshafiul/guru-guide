import "./Complaint.css";
import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import useLocalStorage from "../../useLocalStorage";
import { useState, useRef } from "react";
import TextInput from "../TextInput/TextInput";
import { useQuery, useQueryClient } from "react-query";
import {
  postComplaint,
  getUserComplaint,
  getAllComplaint,
} from "../../Queries";
import { useToasts } from "react-toast-notifications";
import axios from "axios";
import server, { departments } from "../../serverDetails";
import up from "../../assets/img/up.png";
import down from "../../assets/img/down.png";
import refetchicon from "../../assets/img/refetch.svg";

const Complaint = () => {
  const queryClient = useQueryClient();
  const topBarRef = useRef(null);
  const [showHelp, setShowHelp] = useState(false);
  const [tab, setTab] = useLocalStorage("complaintab", "");
  const { addToast } = useToasts();
  const [complaint, setComplaint] = useState("");
  const [page, setPage] = useState(1);
  const [consent, setConsent] = useState(false);
  const { isSuccess, isLoading, isError, error, data, isFetching, refetch } =
    useQuery(["/api/complain/single"], getUserComplaint);

  const {
    isSuccess: isComplaintSuccess,
    data: complaintData,
    refetch: complaintRefetch,
  } = useQuery(["/api/complain", page], getAllComplaint);

  async function submitComplaint() {
    const data = await postComplaint({ complaint });
    if (data.success) {
      addToast("Thanks for your feedback.");
      setComplaint("");
      refetch();
      complaintRefetch();
      setConsent(false);
    }
  }
  async function submitComplaintVote(complaintID, voteType) {
    const res = await axios.post(
      server.url + "/api/complainvote/" + complaintID,
      { voteType },
      { withCredentials: true }
    );
    const resData = res.data;
    const cacheExists = queryClient.getQueryData(["/api/complain", page]);
    if (cacheExists) {
      queryClient.setQueryData(["/api/complain", page], (prevData) => {
        for (let i = 0; i < prevData.data.length; i++) {
          let currentComplaint = prevData.data[i];
          if (currentComplaint.complainID == complaintID) {
            switch (resData.message) {
              case "upvoteinsert":
                currentComplaint.upVoteSum = currentComplaint.upVoteSum + 1;
                break;
              case "downvoteinsert":
                currentComplaint.downVoteSum = currentComplaint.downVoteSum + 1;
                break;
              case "upvoteupdate":
                currentComplaint.upVoteSum = currentComplaint.upVoteSum + 1;
                currentComplaint.downVoteSum = currentComplaint.downVoteSum - 1;
                break;
              case "downvoteupdate":
                currentComplaint.downVoteSum = currentComplaint.downVoteSum + 1;
                currentComplaint.upVoteSum = currentComplaint.upVoteSum - 1;
                break;
              case "noupdate":
                addToast("Thank you. We got your vote!");
                break;
            }
          }
        }
        return prevData;
      });
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

  return (
    <motion.div
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      <h1 className="global-header"> Complaint Box</h1>
      <div className="tab-btn-wrapper" ref={topBarRef}>
        <div
          className={
            tab === "complaints" ? "tab-btn tab-btn-active" : "tab-btn"
          }
          onClick={(e) => setTab("complaints")}
        >
          Complaints
        </div>
        <div
          className={
            tab === "addcomplaint" ? "tab-btn tab-btn-active" : "tab-btn"
          }
          onClick={(e) => setTab("addcomplaint")}
        >
          Post complaint
        </div>
      </div>
      <div
        className="global-info-header"
        onClick={(event) => setShowHelp((prev) => !prev)}
      >
        {showHelp
          ? "There's always some drama in each semester. It usually goes like, authority takes a sudden decision >  students disagree > authority changes deicison (not always though ;)) So you might have already guessed it, Here we post all our complaints about each and everything and see which one is best complaint!"
          : "What's this?"}
      </div>

      {tab === "addcomplaint" && (
        <>
          {isSuccess && typeof data !== "undefined" && data.data.length > 0 ? (
            <>
              <div className="global-info-text">Your current complaint:</div>
              <div className="complaint-wrapper">
                <div className="comment-text">{data.data[0].complainText}</div>
                <div className="comment-buttons">
                  <div className="vote">
                    <div className="icon up">
                      <img className="icon-img" src={up} />
                    </div>
                    <div className="vote-count">{data.data[0].upVoteSum}</div>
                  </div>
                  <div className="vote">
                    <div className="icon down">
                      <img className="icon-img" src={down} />
                    </div>
                    <div className="vote-count">{data.data[0].downVoteSum}</div>
                  </div>
                </div>
              </div>
              <div className="global-info-text">
                Since we have endless complaints, it only makes sense that we
                keep it short and precise. You can post only one complaint at a
                time. If you post another one it will replace your current
                complaint.
              </div>
              <div
                className="global-btn-full"
                onClick={() =>
                  setConsent((prevConsent) => {
                    return !prevConsent;
                  })
                }
              >
                I want to replace my current complaint!
              </div>
              {consent && (
                <>
                  <TextInput
                    value={complaint}
                    type={"textarea"}
                    setValue={setComplaint}
                    limit={500}
                    finalRegex={/^[a-zA-Z0-9 ,.()?:-_'"!]{10,500}$/}
                    allowedRegex={/^[a-zA-Z0-9 ,.()?:-_'"!]*$/}
                    lowercase={true}
                    errorMsg={`Please type at least 10 characters!.`}
                    placeholder={`Type your complaint here...`}
                  />
                  <div className="global-btn-full" onClick={submitComplaint}>
                    Post your complaint
                  </div>{" "}
                </>
              )}
            </>
          ) : (
            <>
              <TextInput
                value={complaint}
                type={"textarea"}
                setValue={setComplaint}
                limit={500}
                finalRegex={/^[a-zA-Z0-9 ,.()?:-_'"!]{10,500}$/}
                allowedRegex={/^[a-zA-Z0-9 ,.()?:-_'"!]*$/}
                lowercase={true}
                errorMsg={`Please type at least 10 characters!.`}
                placeholder={`Type your complaint here...`}
              />
              <div className="global-btn-full" onClick={submitComplaint}>
                Post your complaint
              </div>{" "}
            </>
          )}
        </>
      )}

      {tab === "complaints" && (
        <>
          <motion.div
            whileTap={{ scale: 0.8 }}
            className="global-refetch-btn"
            onClick={() => complaintRefetch()}
          >
            <img src={refetchicon} />
            <div className="global-refetch-btn-title">Refresh</div>
          </motion.div>
          {isComplaintSuccess &&
          typeof complaintData !== "undefined" &&
          complaintData.data.length > 0
            ? complaintData.data.map(function (complaint) {
                return (
                  <div key={complaint.complainID} className="complaint-wrapper">
                    <div className="comment-text">{complaint.complainText}</div>
                    <div className="comment-buttons">
                      <div className="vote">
                        <div
                          className="icon up"
                          onClick={() => {
                            submitComplaintVote(complaint.complainID, 1);
                          }}
                        >
                          <img className="icon-img" src={up} />
                        </div>
                        <div className="vote-count">{complaint.upVoteSum}</div>
                      </div>
                      <div className="vote">
                        <div
                          className="icon down"
                          onClick={() => {
                            submitComplaintVote(complaint.complainID, 0);
                          }}
                        >
                          <img className="icon-img" src={down} />
                        </div>
                        <div className="vote-count">
                          {complaint.downVoteSum}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : null}

          {isComplaintSuccess && typeof complaintData !== "undefined" && (
            <div className="comment-page-buttons">
              {page > 1 && (
                <div
                  className="comment-prev-btn"
                  onClick={() => {
                    topBarRef.current.scrollIntoView({ behavior: "smooth" });
                    setPage((prevPage) => prevPage - 1);
                  }}
                >
                  {`<< Prev`}
                </div>
              )}
              {complaintData.data.length >= 9 && (
                <div
                  className="comment-next-btn"
                  onClick={() => {
                    topBarRef.current.scrollIntoView({ behavior: "smooth" });
                    setPage((prevPage) => prevPage + 1);
                  }}
                >
                  {`Next >>`}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Complaint;
