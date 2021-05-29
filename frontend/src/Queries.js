import axios from "axios";
import server from "./serverDetails";

export const getFaculty = async ({ queryKey }) => {
  const [key, departmentID] = queryKey;
  const res = await axios.get(
    server.url + "/api/faculty/department/" + departmentID,
    { withCredentials: true }
  );
  return res.data;
};
export const getCourse = async ({ queryKey }) => {
  const [key, departmentID] = queryKey;
  const res = await axios.get(
    server.url + "/api/course/department/" + departmentID,
    {
      withCredentials: true,
    }
  );
  console.log(res.data);
  return res.data;
};

export const getFacultyVerification = async ({ queryKey }) => {
  const [key, departmentID] = queryKey;
  const res = await axios.get(
    server.url + "/api/facultyverify/" + departmentID,
    { withCredentials: true }
  );
  return res.data;
};

export const getAFacultyVerification = async ({ queryKey }) => {
  const [key, departmentID, facultyInitials] = queryKey;
  const res = await axios.get(
    server.url + "/api/facultyverify/" + departmentID + "/" + facultyInitials,
    { withCredentials: true }
  );
  return res.data;
};

export const getCourseVerification = async ({ queryKey }) => {
  const [key, departmentID] = queryKey;
  const res = await axios.get(
    server.url + "/api/courseverify/" + departmentID,
    { withCredentials: true }
  );
  return res.data;
};

export const getACourseVerification = async ({ queryKey }) => {
  const [key, departmentID, courseCode] = queryKey;
  const res = await axios.get(
    server.url + "/api/courseverify/" + departmentID + "/" + courseCode,
    { withCredentials: true }
  );
  return res.data;
};

export const getAFaculty = async ({ queryKey }) => {
  const [keyName, id] = queryKey;
  const res = await axios.get(server.url + "/api/faculty/" + id, {
    withCredentials: true,
  });
  return res.data;
};

export const getComment = async ({ queryKey }) => {
  const [keyName, facultyID, courseID, commentPage] = queryKey;
  const res = await axios.get(
    server.url +
      "/api/comment/" +
      facultyID +
      "/" +
      courseID +
      "?page=" +
      commentPage,
    { withCredentials: true }
  );
  return res.data;
};

export const getUserComment = async ({ queryKey }) => {
  const [keyName, facultyID, courseID] = queryKey;
  const res = await axios.get(
    server.url + "/api/usercomment/" + facultyID + "/" + courseID,
    { withCredentials: true }
  );
  return res.data;
};

export const getUserComplaint = async () => {
  const res = await axios.get(server.url + "/api/complain/single", {
    withCredentials: true,
  });
  return res.data;
};

export const getAllComplaint = async ({ queryKey }) => {
  const [keyName, page] = queryKey;
  const res = await axios.get(server.url + "/api/complain/" + "?page=" + page, {
    withCredentials: true,
  });
  return res.data;
};

export const getUserRating = async ({ queryKey }) => {
  const [keyName, facultyID, courseID] = queryKey;
  const res = await axios.get(
    server.url + "/api/userrating/" + facultyID + "/" + courseID,
    { withCredentials: true }
  );
  return res.data;
};

export const getRatingForACourse = async ({ queryKey }) => {
  const [keyName, facultyID, courseID] = queryKey;
  const res = await axios.get(
    server.url + "/api/facultyrating/" + facultyID + "/" + courseID,
    { withCredentials: true }
  );
  return res.data;
};

export const postRating = async ({ rating, facultyID, courseID }) => {
  const res = await axios.post(
    server.url + "/api/facultyrate/" + facultyID,
    { ...rating, courseID },
    { withCredentials: true }
  );
  return res.data;
};

export const postComment = async ({ comment, facultyID, courseID }) => {
  const res = await axios.post(
    server.url + "/api/comment/" + facultyID + "/" + courseID,
    { comment },
    { withCredentials: true }
  );
  return res.data;
};

export const postComplaint = async ({ complaint }) => {
  const res = await axios.post(
    server.url + "/api/complain/",
    { complaintText: complaint },
    { withCredentials: true }
  );
  return res.data;
};

export const postFaculty = async ({
  departmentID,
  facultyInitials,
  facultyName,
}) => {
  const res = await axios.post(
    server.url + "/api/faculty/",
    { departmentID, facultyInitials, facultyName },
    { withCredentials: true }
  );
  return res.data;
};

export const postCourse = async ({ departmentID, courseCode, courseTitle }) => {
  const res = await axios.post(
    server.url + "/api/course/",
    { departmentID, courseCode, courseTitle },
    { withCredentials: true }
  );
  return res.data;
};

export const postCommentVote = async ({ voteType, commentID }) => {
  const res = await axios.post(
    server.url + "/api/commentVote/" + commentID,
    { voteType },
    { withCredentials: true }
  );
  return res.data;
};

export const postFacultyVote = async ({ voteType, facultyID }) => {
  const res = await axios.post(
    server.url + "/api/facultyvote/" + facultyID,
    { voteType },
    { withCredentials: true }
  );
  return res.data;
};

export const postCourseVote = async ({ voteType, courseID }) => {
  const res = await axios.post(
    server.url + "/api/coursevote/" + courseID,
    { voteType },
    { withCredentials: true }
  );
  return res.data;
};
