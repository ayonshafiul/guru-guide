import "./FacultyListItem.css";
import { Link } from "react-router-dom";
import up from "../../assets/img/up.png";
import down from "../../assets/img/down.png";
import { useState } from "react";
import VerifyConsent from "../VerifyConsent/VerifyConsent";
import VerifyPicker from "../VerifyPicker/VerifyPicker";
import { useQuery } from "react-query";
import { getAFacultyVerification } from "../../Queries";

const FacultyListItem = (props) => {
  const [showVerify, setShowVerify] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [legitFaculty, setLegitFaculty] = useState("");
  const [legitFacultyID, setLegitFacultyID] = useState(0);
  const [report, setReport] = useState("");
  let {
    facultyName,
    facultyID,
    facultyInitials,
    teaching,
    grading,
    friendliness,
    voteCount,
    fuid,
    duplicateCount,
    departmentID,
  } = props.faculty;
  const { isSuccess: facultyVerifyIsSuccess, data: facultyVerifyData } =
    useQuery(
      ["/api/facultyverify", String(departmentID), String(facultyInitials)],
      getAFacultyVerification,
      {
        enabled: legitFaculty === "no",
        onSuccess: function (data) {
          console.log(data);
        },
      }
    );

  async function submitVote() {
    console.log(legitFaculty);
  }

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
              setReport("");
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
              setLegitFaculty("");
              setLegitFacultyID(0);
            }}
          >
            <img src={showReport ? up : down} />
            Report
          </div>
        </div>
      )}

      {showVerify && (
        <>
          <VerifyConsent
            question="Are you sure the faculty initals and faculty name given above are correct?"
            yesButtonHandler={() => {
              setLegitFaculty("yes");
            }}
            noButtonHandler={() => {
              setLegitFaculty("no");
            }}
            answerStateVariable={legitFaculty}
            margin={true}
          />
          {legitFaculty === "no" && (
            <VerifyPicker
              header="Choose which entry is the correct one from below: "
              idKeyName="facultyID"
              titleKeyName="facultyName"
              verifySelectedID={legitFacultyID}
              setVerifySelectedID={setLegitFacultyID}
              optionsData={facultyVerifyData}
              submitHandler={submitVote}
              allowNoVote={true}
              submitButtonText="Submit verification"
              margin={true}
            />
          )}
        </>
      )}
      {showReport && (
        <VerifyConsent
          question="Do you think that this entry contains offensive language and/or out of context details?"
          yesButtonHandler={() => {
            setReport("yes");
          }}
          noButtonHandler={() => {
            setReport("no");
          }}
          answerStateVariable={report}
          margin={true}
        />
      )}
    </>
  );
};

export default FacultyListItem;
