import "./QueryItem.css";
import { useQuery } from "react-query";
import {useState} from "react";
import {} from "../../Queries";

const QueryItem = (props) => {
  const { queryID, queryText, rateCount } = props.query;
  return (
    <div className="query">
      <div className="query-text">{queryText}</div>
    </div>
  );
};

export default QueryItem;
