import axios from 'axios';
import server from './serverDetails';
export const getFaculty = async ( ) => {
    const res = await axios.get(server.url + "/api/faculty", {withCredentials: true});
    return res.data;
}

export const getAFaculty = async ({ queryKey }) => {
    const [keyName, id] = queryKey;
    const res = await axios.get(server.url + "/api/faculty/" + id, {withCredentials: true});
    return res.data;
}

export const getComment = async ({ queryKey }) => {
    const [keyName, id] = queryKey;
    const res = await axios.get(server.url + "/api/comment/" + id, {withCredentials: true});
    return res.data;
}