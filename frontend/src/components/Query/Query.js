import "./Query.css";
import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import { useState, useContext, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Redirect, useLocation } from "react-router-dom";
import useLocalStorage from "../../useLocalStorage";
import TextInput from "../TextInput/TextInput";
import { postQuery, getAllQueries, getUserQuery } from "../../Queries";
import { useQuery, useQueryClient } from "react-query";
import { useToasts } from "react-toast-notifications";
import QueryItem from "../QueryItem/QueryItem";
import axios from "axios";
import server from "../../serverDetails";
import refetchicon from "../../assets/img/refetch.svg";

const Query = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const pageRef = useRef(null);
  const { isAuth } = useContext(AuthContext);
  const { addToast } = useToasts();
  const [tab, setTab] = useLocalStorage("querytab", "");
  const [page, setPage] = useState(1);
  const [userQueryPage, setUserQueryPage] = useState(1);
  const [showHelp, setShowHelp] = useState(false);
  const [showQueryInput, setShowQueryInput] = useState(true);
  const [queryText, setQueryText] = useState("");
  const finalRegex = /^[a-zA-Z0-9 ,.()?:-_'"!]{10,500}$/;
  const allowedRegex = /^[a-zA-Z0-9 ,.()?:-_'"!]*$/;
  const {
    isSuccess: isQuerySuccess,
    data: queryData,
    refetch: queryRefetch,
  } = useQuery(["/api/query", String(page)], getAllQueries);
  const { data: userQueryData, refetch: userQueryRefetch } = useQuery(
    ["/api/userquery", String(userQueryPage)],
    getUserQuery,
    {
      enabled: tab === "myqueries",
    }
  );
  if (!isAuth)
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: location },
        }}
      ></Redirect>
    );
  async function submitQuery() {
    if (queryText.match(finalRegex)) {
      console.log(queryText);
      const data = await postQuery({ queryText });
      console.log(data);
      if (data.success) {
        addToast("Hope you will get your answer. :)");
        setQueryText("");
        setUserQueryPage(1);
        setPage(1);
        setShowQueryInput(false);
        queryRefetch();
        userQueryRefetch();
      } else if (data.message === "toosoon") {
        addToast("Please wait a minute before you post another query!");
      }
    } else {
      addToast("Please type at least 10 characters!");
    }
  }
  async function submitQueryVote(queryID, voteType) {
    const res = await axios.post(
      server.url + "/api/queryvote/" + queryID,
      { voteType },
      { withCredentials: true }
    );
    const resData = res.data;
    const cacheExists = queryClient.getQueryData(["/api/query", String(page)]);
    if (cacheExists) {
      queryClient.setQueryData(["/api/query", String(page)], (prevData) => {
        for (let i = 0; i < prevData.data.length; i++) {
          let currentQuery = prevData.data[i];
          if (currentQuery.queryID == queryID) {
            switch (resData.message) {
              case "upvoteinsert":
                currentQuery.upVoteSum = currentQuery.upVoteSum + 1;
                break;
              case "downvoteinsert":
                currentQuery.downVoteSum = currentQuery.downVoteSum + 1;
                break;
              case "upvoteupdate":
                currentQuery.upVoteSum = currentQuery.upVoteSum + 1;
                currentQuery.downVoteSum = currentQuery.downVoteSum - 1;
                break;
              case "downvoteupdate":
                currentQuery.downVoteSum = currentQuery.downVoteSum + 1;
                currentQuery.upVoteSum = currentQuery.upVoteSum - 1;
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
      <h1 className="global-header"> Queries</h1>

      <div className="tab-btn-wrapper" ref={pageRef}>
        <div
          className={tab === "queries" ? "tab-btn tab-btn-active" : "tab-btn"}
          onClick={(e) => {
            setTab("queries");
          }}
        >
          Queries
        </div>
        <div
          className={tab === "myqueries" ? "tab-btn tab-btn-active" : "tab-btn"}
          onClick={(e) => setTab("myqueries")}
        >
          My Queries
        </div>
      </div>

      <div
        className="global-info-header"
        onClick={(event) => setShowHelp((prev) => !prev)}
      >
        {showHelp
          ? "This section is just like a youtube comment section but people ask here questions and get answers! Please keep in mind that eveyrone can see your questions and answers. So, try to maintain a high level of decency."
          : "What's this?"}
      </div>
      {tab === "queries" && isQuerySuccess && typeof queryData !== "undefined" && (
        <>
          <motion.div
            whileTap={{ scale: 0.8 }}
            className="global-refetch-btn"
            onClick={() => queryRefetch()}
          >
            <img src={refetchicon} />
            <div className="global-refetch-btn-title">Refresh</div>
          </motion.div>
          {queryData.data.map((query) => {
            return (
              <QueryItem
                key={query.queryID}
                query={query}
                submitQueryVote={submitQueryVote}
              />
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
            {typeof queryData !== "undefined" && queryData.data.length >= 10 && (
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
        </>
      )}

      {tab === "myqueries" && (
        <>
          {showQueryInput && (
            <>
              <TextInput
                value={queryText}
                type={"textarea"}
                setValue={setQueryText}
                limit={500}
                finalRegex={finalRegex}
                allowedRegex={allowedRegex}
                lowercase={true}
                errorMsg={`Please type at least 10 characters!.`}
                placeholder={`Type your query here...`}
              />
              <div className="global-btn-full" onClick={submitQuery}>
                Post your query
              </div>
            </>
          )}{" "}
          {!showQueryInput && (
            <div
              className="global-btn-full"
              onClick={() => {
                setShowQueryInput(true);
              }}
            >
              I have another query!
            </div>
          )}
          <div className="global-info-text">
            Your previous queries are listed below:{" "}
          </div>
          {typeof userQueryData !== "undefined" &&
            userQueryData.data.map((query) => {
              return (
                <QueryItem
                  key={query.queryID}
                  query={query}
                  submitQueryVote={() => {
                    addToast("Please do not vote on your own post!");
                  }}
                />
              );
            })}
          <div className="comment-page-buttons">
            {userQueryPage > 1 && (
              <div
                className="comment-prev-btn"
                onClick={() => {
                  pageRef.current.scrollIntoView({ behavior: "smooth" });
                  setUserQueryPage((prevPage) => prevPage - 1);
                }}
              >
                {`<< Prev`}
              </div>
            )}
            {typeof userQueryData !== "undefined" &&
              userQueryData.data.length >= 10 && (
                <div
                  className="comment-next-btn"
                  onClick={() => {
                    pageRef.current.scrollIntoView({ behavior: "smooth" });
                    setUserQueryPage((prevPage) => prevPage + 1);
                  }}
                >
                  {`Next >>`}
                </div>
              )}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Query;
