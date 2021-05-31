import "./Query.css";
import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Redirect, useLocation } from "react-router-dom";
import useLocalStorage from "../../useLocalStorage";
import TextInput from "../TextInput/TextInput";
import { postQuery, getAllQueries } from "../../Queries";
import { useQuery } from "react-query";
import { useToasts } from "react-toast-notifications";
import QueryItem from "../QueryItem/QueryItem";

const Query = () => {
  const location = useLocation();
  const { isAuth } = useContext(AuthContext);
  const { addToast } = useToasts();
  const [tab, setTab] = useLocalStorage("querytab", "");
  const [page, setPage] = useState(1);
  const [showQueryInput, setShowQueryInput] = useState(true);
  const [queryText, setQueryText] = useState("");
  const finalRegex = /^[a-zA-Z0-9 ,.()?:-_'"!]{10,300}$/;
  const allowedRegex = /^[a-zA-Z0-9 ,.()?:-_'"!]*$/;
  const {
    isSuccess: isQuerySuccess,
    data: queryData,
    refetch: queryRefetch,
  } = useQuery(["/api/query", page], getAllQueries);
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
      const data = await postQuery({ queryText });
      if (data.success) {
        setQueryText("");
        setShowQueryInput(false);
        queryRefetch();
      }
    } else {
      addToast("Please type at least 10 characters!");
    }
  }
  return (
    <motion.div
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      <h1 className="global-header"> Queries</h1>
      <div className="tab-btn-wrapper">
        <div
          className={tab === "queries" ? "tab-btn tab-btn-active" : "tab-btn"}
          onClick={(e) => {
            setTab("queries");
            setShowQueryInput(true);
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
      {tab === "queries" && isQuerySuccess && typeof queryData !== "undefined" && (
        <>
          {queryData.data.map((query) => {
            return <QueryItem key={query.queryID} query={query} />;
          })}
        </>
      )}

      {tab === "myqueries" && showQueryInput && (
        <>
          <TextInput
            value={queryText}
            type={"textarea"}
            setValue={setQueryText}
            limit={300}
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
      )}
    </motion.div>
  );
};

export default Query;
