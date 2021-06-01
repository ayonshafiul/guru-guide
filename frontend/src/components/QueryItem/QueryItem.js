import "./QueryItem.css";
import { useQuery, useQueryClient } from "react-query";
import { useState, useRef } from "react";
import { getAllReplies, postReply } from "../../Queries";
import up from "../../assets/img/up.png";
import down from "../../assets/img/down.png";
import TextInput from "../TextInput/TextInput";
import { useToasts } from "react-toast-notifications";
import { revealAnimation, slideAnimationVariant } from "../../AnimationData";
import { motion } from "framer-motion";
import axios from "axios";
import server from "../../serverDetails";

const QueryItem = (props) => {
  const { queryID, queryText, replyCount, upVoteSum, downVoteSum } =
    props.query;
  const queryClient = useQueryClient();
  const pageRef = useRef(null);
  const [initialReplyCont, setInitialReplyCont] = useState(replyCount);
  const { addToast } = useToasts();
  const [page, setPage] = useState(1);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState("");
  const finalRegex = /^[a-zA-Z0-9 ,.()?:-_'"!]{10,300}$/;
  const allowedRegex = /^[a-zA-Z0-9 ,.()?:-_'"!]*$/;
  const { isSuccess, data, refetch } = useQuery(
    ["/api/reply", String(queryID), String(page)],
    getAllReplies,
    {
      enabled: showReply,
    }
  );

  async function submitReply() {
    if (reply.match(finalRegex)) {
      const data = await postReply({ reply, queryID });
      if (data.success) {
        addToast("Thanks for the feedback!");
        setReply("");
        refetch();
        setInitialReplyCont((prevCount) => prevCount + 1);
        setShowReplyInput(false);
        setShowReply(true);
      }
    } else {
      addToast("Please type at least 10 characters!");
    }
  }

  async function submitReplyVote(replyID, voteType) {
    const res = await axios.post(
      server.url + "/api/replyvote/" + replyID,
      { voteType },
      { withCredentials: true }
    );
    const resData = res.data;
    console.log(resData);
    const cacheExists = queryClient.getQueryData([
      "/api/reply",
      String(queryID),
      String(page),
    ]);
    if (cacheExists) {
      queryClient.setQueryData(
        ["/api/reply", String(queryID), String(page)],
        (prevData) => {
          console.log(prevData);
          for (let i = 0; i < prevData.data.length; i++) {
            let currentReply = prevData.data[i];
            if (currentReply.replyID == replyID) {
              switch (resData.message) {
                case "upvoteinsert":
                  currentReply.upVoteSum = currentReply.upVoteSum + 1;
                  break;
                case "downvoteinsert":
                  currentReply.downVoteSum = currentReply.downVoteSum + 1;
                  break;
                case "upvoteupdate":
                  currentReply.upVoteSum = currentReply.upVoteSum + 1;
                  currentReply.downVoteSum = currentReply.downVoteSum - 1;
                  break;
                case "downvoteupdate":
                  currentReply.downVoteSum = currentReply.downVoteSum + 1;
                  currentReply.upVoteSum = currentReply.upVoteSum - 1;
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

  return (
    <>
      <div className="query">
        <div
          className="query-text"
          onClick={(event) => {
            event.target.innerText = queryText;
          }}
        >
          {downVoteSum > upVoteSum
            ? "Negative content ahead! *CLICK* to view anyway."
            : queryText}
        </div>
        <div className="comment-buttons">
          <div className="vote">
            <div
              className="icon up"
              onClick={() => props.submitQueryVote(queryID, 1)}
            >
              <img className="icon-img" src={up} />
            </div>
            <div className="vote-count">{upVoteSum}</div>
          </div>
          <div className="vote">
            <div
              className="icon down"
              onClick={() => props.submitQueryVote(queryID, 0)}
            >
              <img className="icon-img" src={down} />
            </div>
            <div className="vote-count">{downVoteSum}</div>
          </div>
        </div>
        <div className="reply-section-wrapper" ref={pageRef}>
          <div
            className="reply-btn-wrapper"
            onClick={() => {
              setShowReplyInput((prevInput) => !prevInput);
              setShowReply(false);
            }}
          >
            <div className="reply-view-icon">
              <img src={showReplyInput ? up : down} />
            </div>
            <div className="reply-btn">Reply</div>
          </div>
          <div
            className="reply-view-wrapper"
            onClick={() => {
              setShowReply((prevReply) => !prevReply);
              setShowReplyInput(false);
            }}
          >
            <div className="reply-view-icon">
              <img src={showReply ? up : down} />
            </div>
            <div className="reply-view-text">
              View{" "}
              {typeof data !== "undefined"
                ? Math.max(data.data.length, initialReplyCont)
                : replyCount}{" "}
              replie(s)
            </div>
          </div>
        </div>
      </div>
      {showReplyInput && (
        <motion.div
          variants={slideAnimationVariant}
          initial="initial"
          animate="animate"
        >
          <TextInput
            value={reply}
            type={"textarea"}
            setValue={setReply}
            limit={300}
            finalRegex={finalRegex}
            allowedRegex={allowedRegex}
            lowercase={true}
            errorMsg={`Please type at least 10 characters!.`}
            placeholder={`Type your reply here...`}
          />
          <div className="global-btn-full" onClick={submitReply}>
            Post your reply
          </div>{" "}
        </motion.div>
      )}{" "}
      {showReply && typeof data !== "undefined" && (
        <motion.div
          variants={revealAnimation}
          initial="initial"
          animate="animate"
        >
          {data.data.map((reply) => {
            return (
              <div className="reply-wrapper">
                <div className="reply">
                  <div
                    className="reply-text"
                    onClick={(event) => {
                      event.target.innerText = reply.replyText;
                    }}
                  >
                    {reply.downVoteSum > reply.upVoteSum
                      ? "Negative content ahead! *CLICK* to view anyway."
                      : reply.replyText}
                  </div>
                  <div className="comment-buttons">
                    <div className="vote">
                      <div
                        className="icon up"
                        onClick={() => submitReplyVote(reply.replyID, 1)}
                      >
                        <img className="icon-img" src={up} />
                      </div>
                      <div className="vote-count">{reply.upVoteSum}</div>
                    </div>
                    <div className="vote">
                      <div
                        className="icon down"
                        onClick={() => submitReplyVote(reply.replyID, 0)}
                      >
                        <img className="icon-img" src={down} />
                      </div>
                      <div className="vote-count">{reply.downVoteSum}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="comment-page-buttons">
            {page > 1 && (
              <div
                className="comment-prev-btn"
                onClick={() => {
                  pageRef.current.scrollIntoView({ behavior: "smooth" });
                  setPage((prevPage) => prevPage - 1);
                }}
              >
                {`<< Prev`}
              </div>
            )}
            {typeof data !== "undefined" && data.data.length >= 10 && (
              <div
                className="comment-next-btn"
                onClick={() => {
                  pageRef.current.scrollIntoView({ behavior: "smooth" });
                  setPage((prevPage) => prevPage + 1);
                }}
              >
                {`Next >>`}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default QueryItem;
