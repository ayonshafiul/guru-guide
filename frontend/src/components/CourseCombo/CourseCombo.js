import "./CourseCombo.css";
import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import { useState, useContext } from "react";
import { useQuery } from "react-query";
import { getCourse, getACourse } from "../../Queries";
import { departments } from "../../serverDetails";
import { AuthContext } from "../../contexts/AuthContext";
import { Redirect, useLocation } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import CourseListItem from "../CourseListItem/CourseListItem";
import { showCourseRatingSection } from "../CourseDetails/CourseDetails";
import refetchicon from "../../assets/img/refetch.svg";

const CourseCombo = () => {
  const location = useLocation();
  const { isAuth } = useContext(AuthContext);
  const { addToast } = useToasts();
  const [departmentID, setDepartmentID] = useState("0");
  const [courseID, setCourseID] = useState("0");
  const [courseCombo, setCourseCombo] = useState([]);
  const {
    isLoading: courseIsLoading,
    isSuccess: courseIsSuccess,
    isFetching: courseIsFetching,
    data: courseData,
    error: courseError,
    isError: courseIsError,
  } = useQuery(["/api/course", departmentID], getCourse, {
    enabled: parseInt(departmentID) !== 0,
  });

  async function addCourse() {
    if (parseInt(courseID) !== 0) {
      let exists = courseCombo.find((course) => {
        if (parseInt(course.courseID) === parseInt(courseID)) return true;
      });
      if (courseCombo.length < 6) {
        if (!exists) {
          const data = await getACourse({
            queryKey: ["/api/course", courseID],
          });
          if (data.success) {
            setCourseCombo((prevCombo) => {
              let arr = [...prevCombo];
              arr.push(data.data);
              return arr;
            });
            setCourseID("0");
          } else {
            addToast("Couldn't load the course Data. :(");
          }
        } else {
          addToast(
            "You have already selected this course. Please select other courses."
          );
        }
      } else {
        addToast("Can you even take seven courses in BRACU? :)");
      }
    }
  }

  let totalDifficulty = 0;
  courseCombo.forEach((course) => {
    totalDifficulty += parseInt(course.difficulty);
  });

  if (!isAuth)
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: location },
        }}
      ></Redirect>
    );
  return (
    <motion.div
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      <h1 className="global-header"> Course Combo</h1>
      <div className="course-wrapper">
        <select
          className="select-css"
          value={departmentID}
          onChange={(e) => {
            setDepartmentID(String(e.target.value));
            setCourseID("0");
          }}
        >
          {departments.map((department, index) => {
            if (index != 8) {
              return (
                <option key={department} value={index}>
                  {department}
                </option>
              );
            }
          })}
        </select>
        {parseInt(departmentID) !== 0 && typeof courseData !== "undefined" && (
          <select
            className="select-css"
            value={courseID}
            onChange={(e) => {
              // setCourseCode(e.target.options[e.target.selectedIndex].text);
              setCourseID(String(e.target.value));
            }}
          >
            <option value="0">SELECT COURSE</option>
            {typeof courseData !== "undefined" &&
              courseData.data
                .sort((c1, c2) => {
                  return c1.courseCode > c2.courseCode ? 1 : -1;
                })
                .map((course) => {
                  return (
                    <option
                      key={course.courseID}
                      value={String(course.courseID)}
                    >
                      {course.courseCode}
                    </option>
                  );
                })}
          </select>
        )}
      </div>
      {parseInt(courseID) !== 0 && (
        <div className="submit-btn" onClick={addCourse}>
          Add Course
        </div>
      )}

      {courseCombo.map((course) => {
        return (
          <CourseListItem
            key={course.courseCode}
            course={course}
            hideLink={true}
          />
        );
      })}
      {courseCombo.length > 0 ? (
        <>
          <motion.div
            whileTap={{ scale: 0.8 }}
            className="global-refetch-btn"
            onClick={() => setCourseCombo([])}
          >
            <img src={refetchicon} />
            <div className="global-refetch-btn-title"> Reset</div>
          </motion.div>
          {showCourseRatingSection(
            "Estimated difficulty for the course choice: ",
            totalDifficulty,
            courseCombo.length,
            true
          )}
        </>
      ) : null}
    </motion.div>
  );
};

export default CourseCombo;
