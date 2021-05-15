import { motion } from "framer-motion";
import pageAnimationVariant from "../../AnimationData";
import "../FacultyDetails/FacultyDetails.css";
import "./Contribute.css";
import { departments } from "../../serverDetails";
import TextInput from "../TextInput/TextInput";
import { useState } from "react";
import { postCourse, postFaculty } from "../../Queries";
import { useToasts } from "react-toast-notifications";
const Contribute = () => {
  const { addToast } = useToasts();
  const [tab, setTab] = useState("");
  const [departmentID, setDepartmentID] = useState(0);
  const [initials, setInitials] = useState("");
  const [name, setName] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  async function submitFaculty() {
    const inRegex = /^[a-zA-Z]{3}$/;
    const nameRegex = /^$/;
    if (
      departmentID != 0 &&
      initials.match(inRegex) &&
      name.length >= 3 &&
      name.length <= 50
    ) {
      const data = await postFaculty({
        departmentID,
        facultyInitials: initials,
        facultyName: name,
      });
      if (data.success) {
        addToast("Thanks for your contribution!");
      }
    }
  }
  async function submitCourse() {
    const ccRegex = /^[a-zA-Z]{3}[0-9]{3}$/;
    if (
      departmentID != 0 &&
      courseCode.match(ccRegex) &&
      courseTitle.length >= 3 &&
      courseTitle.length <= 50
    ) {
      const data = await postCourse({ departmentID, courseCode, courseTitle });
      if (data.success) {
        addToast("Thanks for your contribution!");
      }
    }
  }
  return (
    <motion.div
      className="verify"
      variants={pageAnimationVariant}
      initial="initial"
      animate="animate"
    >
      <div className="tab-btn-wrapper">
        <div
          className={tab === "faculty" ? "tab-btn tab-btn-active" : "tab-btn"}
          onClick={(e) => setTab("faculty")}
        >
          Add Faculty
        </div>
        <div
          className={tab === "course" ? "tab-btn tab-btn-active" : "tab-btn"}
          onClick={(e) => setTab("course")}
        >
          Add Course
        </div>
      </div>
      {tab === "faculty" && (
        <>
          <div className="verify-wrapper">
            <div className="section-title">Faculty Add</div>
            <select
              className="select-css select-full"
              value={departmentID}
              onChange={(e) => {
                setDepartmentID(e.target.value);
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
            <div className="input">
              <TextInput
                value={initials}
                setValue={setInitials}
                limit={3}
                finalRegex={/^[a-zA-Z]{3}$/}
                allowedRegex={/^[a-zA-Z]*$/}
                errorMsg={`Type something like "TBA" :)`}
                placeholder={`Type the initials of the faculty you would like to add to the database`}
              />
            </div>
            <div className="input">
              <TextInput
                value={name}
                setValue={setName}
                limit={50}
                finalRegex={/^[a-zA-Z ]{3, 50}$/}
                allowedRegex={/^[a-zA-Z ]*$/}
                errorMsg={`Type something like "To Be Announced" :)`}
                placeholder={`Type the full name of the faculty you would like to add to the database`}
              />
            </div>
            <div className="submit-btn" onClick={submitFaculty}>
              Add Faculty
            </div>
          </div>
        </>
      )}

      {tab === "course" && (
        <>
          <div className="verify-wrapper">
            <div className="section-title">Course Add</div>
            <select
              className="select-css select-full"
              value={departmentID}
              onChange={(e) => {
                setDepartmentID(e.target.value);
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
            <div className="input">
              <TextInput
                value={courseCode}
                setValue={setCourseCode}
                limit={6}
                type=""
                finalRegex={/^[a-zA-Z]{3}[0-9]{3}$/}
                allowedRegex={/^[a-zA-Z0-9]*$/}
                errorMsg={`Type something like "CSE420" :)`}
                placeholder={`Type the course code of the course you would like to add to the database`}
              />
            </div>
            <div className="input">
              <TextInput
                value={courseTitle}
                setValue={setCourseTitle}
                limit={50}
                type=""
                finalRegex={/^[a-zA-Z ]{3, 50}$/}
                allowedRegex={/^[a-zA-Z ]*$/}
                errorMsg={`Type something like "Introduction to microfinance" :)`}
                placeholder={`Type the full title of the course you would like to add to the database`}
              />
            </div>
            <div className="submit-btn" onClick={submitCourse}>
              Add Course
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Contribute;
