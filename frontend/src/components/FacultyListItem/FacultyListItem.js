import "./FacultyListItem.css";
import { Link } from "react-router-dom";
import up from "../../assets/img/up.png";
import down from "../../assets/img/down.png";
import { useState } from "react";

const FacultyListItem = (props) => {
  const [showVerify, setShowVerify] = useState(false);
  const [showReport, setShowReport] = useState(false);
  let {
    facultyName,
    facultyID,
    facultyInitials,
    teaching,
    grading,
    friendliness,
    voteCount,
    fuid,
  } = props.faculty;
  if (voteCount === 0) {
    voteCount = 0.1;
  }
  let avgTeaching = teaching / voteCount;
  let avgGrading = grading / voteCount;
  let avgFriendliness = friendliness / voteCount;

  return (
    <>
      <Link style={{ textDecoration: "none" }} to={`/faculty/${fuid}`}>
        <div className="faculty-wrapper">
          <div className="name-wrapper">
            <div className="faculty-name">{facultyName}</div>
            <div className="faculty-initials">{facultyInitials}</div>
          </div>
          <div className="rating-wrapper">
            <div className="average-rating">
              {((teaching + grading + friendliness) / (3 * voteCount)).toFixed(
                1
              )}
              <span>&#9733;</span>
            </div>
            <div className="faculty-vote-count">
              T: <span className="red">{avgTeaching.toFixed(1)}</span> G:{" "}
              <span className="red">{avgGrading.toFixed(1)}</span> F:{" "}
              <span className="red">{avgFriendliness.toFixed(1)}</span> <br />
              {voteCount === 0.1 ? "0" : voteCount} vote(s)
            </div>
            <div className="rating-bar-wrapper">
              <div
                className="rating-bar"
                style={{ height: avgTeaching * 2.8 + 2 }}
              ></div>
              <div
                className="rating-bar"
                style={{ height: avgGrading * 2.8 + 2 }}
              ></div>
              <div
                className="rating-bar"
                style={{ height: avgFriendliness * 2.8 + 2 }}
              ></div>
            </div>
          </div>
        </div>
      </Link>
      {props.showVerify && (
        <div className="faculty-list-item-verify-wrapper">
          <div
            className="faculty-list-item-verify"
            onClick={() => {
              setShowVerify((prev) => !prev);
              setShowReport(false);
            }}
          >
            <img src={showVerify ? up : down} />
            Verify
          </div>
          <div
            className="faculty-list-item-report"
            onClick={() => {
              setShowReport((prev) => !prev);
              setShowVerify(false);
            }}
          >
            <img src={showReport ? up : down} />
            Report
          </div>
        </div>
      )}
      
    </>
  );
};

export default FacultyListItem;
