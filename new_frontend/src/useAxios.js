import axios from 'axios';
import {useState, useEffect, useRef} from 'react';
import server from './serverDetails'


const useAxios = (url, options) => {
    const cache = useRef({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const axiosOptions = {
        ...options,
        withCredentials: true
    };
    if(!axiosOptions.url) {
        axiosOptions.url = server.url + url;
    }
    if (!axiosOptions.method) {
        axiosOptions.method = "get";
    }
    useEffect(() => {
        if(!url) return;
        if(cache.current[url]) {
            setResponse(cache.current[url]);
            return;
        }
        axios(axiosOptions).then((res) => {
            cache.current[url] = res.data;
            console.log(cache);
            setResponse(res.data);
        }).catch((err) => {
            setError(error)
        })
    }, []);
    

    return {isLoading, response, error};


}
 
export default useAxios;
