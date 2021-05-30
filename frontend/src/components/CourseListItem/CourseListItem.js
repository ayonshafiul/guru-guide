import "./CourseListItem.css";
import { Link } from "react-router-dom";

const courseListItem = (props) => {
  let { courseTitle, courseID, courseCode, difficulty, rateCount } =
    props.course;
  if (rateCount === 0) {
    rateCount = 0.1;
  }
  let avgDifficulty = difficulty / rateCount;

  return (
    <Link style={{ textDecoration: "none" }} to={`/course/${courseID}`}>
      <div className="course-list-wrapper">
        <div className="course-name-wrapper">
          <div className="course-name">{courseTitle}</div>
          <div className="course-initials">{courseCode}</div>
        </div>
        <div className="course-difficulty-wrapper">
          <span className="span-bg">{avgDifficulty + " "} &#9762;</span>
          <div className="course-list-item-rate-count">{rateCount} vote(s)</div>
          <div
            className={
              avgDifficulty <= 4
                ? "course-difficulty-overlay bg-green"
                : avgDifficulty <= 7
                ? "course-difficulty-overlay bg-yellow"
                : "course-difficulty-overlay bg-red"
            }
            style={{ width: avgDifficulty * 10 + 1 + "%" }}
          ></div>
        </div>
      </div>
    </Link>
  );
};

export default courseListItem;
