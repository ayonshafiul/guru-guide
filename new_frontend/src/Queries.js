import axios from 'axios';
import server from './serverDetails';
export const getFaculty = async ( ) => {
    const res = await axios.get(server.url + "/api/faculty", {withCredentials: true});
    return res.data;
}