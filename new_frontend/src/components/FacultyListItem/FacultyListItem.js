import "./FacultyListItem.css";
import { Link } from "react-router-dom";

const FacultyListItem = (props) => {
  let {
    facultyName,
    facultyID,
    facultyInitials,
    teaching,
    grading,
    friendliness,
    voteCount,
  } = props.faculty;
  if (voteCount === 0) {
    voteCount = 0.1;
  }
  return (
    <Link style={{ textDecoration: "none" }} to={`/faculty/${facultyID}`}>
      <div className="faculty-wrapper">
        <div className="name-wrapper">
          <div className="faculty-name">{facultyName}</div>
          <div className="faculty-initials">{facultyInitials}</div>
        </div>
        <div className="rating-wrapper">
          <div className="average-rating">
            {((teaching + grading + friendliness) / (3 * voteCount)).toFixed(1)}
            <span>&#9733;</span>
          </div>
          <div className="rating-bar-wrapper">
            <div
              className="rating-bar"
              style={{ height: (teaching / voteCount) * 1.8 + 2 }}
            ></div>
            <div
              className="rating-bar"
              style={{ height: (grading / voteCount) * 1.8 + 2 }}
            ></div>
            <div
              className="rating-bar"
              style={{ height: (friendliness / voteCount) * 1.8 + 2 }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FacultyListItem;
