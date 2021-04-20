import axios from 'axios';
import {useState, useEffect} from 'react';
import server from './serverDetails'


const useAxios = (url, options) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [response, setResponse] = useState();

    const axiosOptions = {
        ...options
    };
    if(!axiosOptoins.url) {
        axiosOptions.url = server.url + url;
    }
    if (!axiosOptions.method) {
        axiosOptions.method = "get"
    }

    axios(axiosOptions).then((res) => {
        setResponse(res.data)
    }).catch((err) => {
        setError(error)
    })

    return {isLoading, response, error};


}
 
export default useAxios;
