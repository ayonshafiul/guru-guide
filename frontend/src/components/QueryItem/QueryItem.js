import "./QueryItem.css";
import { useQuery } from "react-query";
import { useState } from "react";
import { getAllReplies, postReply } from "../../Queries";
import up from "../../assets/img/up.png";
import down from "../../assets/img/down.png";
import TextInput from "../TextInput/TextInput";
import { useToasts } from "react-toast-notifications";
import { revealAnimation } from "../../AnimationData";
import { motion } from "framer-motion";

const QueryItem = (props) => {
  const { queryID, queryText, replyCount } = props.query;
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
      onSuccess: function (data) {
        console.log(data);
      },
    }
  );

  async function submitReply() {
    if (reply.match(finalRegex)) {
      const data = await postReply({ reply, queryID });
      if (data.success) {
        addToast("Thanks for the feedback!");
        setReply("");
        refetch();
        setShowReplyInput(false);
        setShowReply(true);
      }
    } else {
      addToast("Please type at least 10 characters!");
    }
  }

  return (
    <>
      <div className="query">
        <div className="query-text">{queryText}</div>
        <div className="reply-section-wrapper">
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
              View {typeof data !== "undefined" ? data.data.length : replyCount}{" "}
              replie(s)
            </div>
          </div>
        </div>
      </div>
      {showReplyInput && (
        <motion.div
          variants={revealAnimation}
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
            return <div className="reply">{reply.replyText}</div>;
          })}
        </motion.div>
      )}
    </>
  );
};

export default QueryItem;
