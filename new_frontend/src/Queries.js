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
  const res = await axios.get(server.url + "/api/course/" + departmentID, {
    withCredentials: true,
  });
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

export const postRating = async ({ rating, facultyID, courseID }) => {
  const res = await axios.post(
    server.url + "/api/facultyrate/" + facultyID,
    { ...rating, courseID },
    { withCredentials: true }
  );
  console.log(res.data);
  return res.data;
};

export const postComment = async ({ comment, facultyID, courseID }) => {
  console.log(comment, facultyID, courseID);
  const res = await axios.post(
    server.url + "/api/comment/" + facultyID + "/" + courseID,
    { comment },
    { withCredentials: true }
  );
  console.log(res.data);
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
