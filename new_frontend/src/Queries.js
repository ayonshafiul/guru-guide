import axios from 'axios';
import server from './serverDetails';
export const getFaculty = async ({queryKey}) => {
    const [key, departmentID] = queryKey;
    const res = await axios.get(server.url + "/api/faculty/department/" + departmentID, {withCredentials: true});
    return res.data;
}

export const getAFaculty = async ({ queryKey }) => {
    const [keyName, id] = queryKey;
    const res = await axios.get(server.url + "/api/faculty/" + id, {withCredentials: true});
    return res.data;
}

export const getComment = async ({ queryKey }) => {
    const [keyName, facultyID, courseID] = queryKey;
    const res = await axios.get(server.url + "/api/comment/" + facultyID + "/" + courseID, {withCredentials: true});
    return res.data;
}


export const postRating = async ({ rating, facultyID }) => {
    const res = await axios.post(server.url + "/api/facultyrate/" + facultyID, {...rating, courseID: 1}, {withCredentials: true});
    return res.data;
}