import { useEffect, useState } from "react";
import axios from "axios";
import { getUsername } from '../helper/helper.js';
export default function useFetch (query) {

    const [ getData, setData ] = useState({isLoading : false, apiData : undefined, status : null, serverError : null});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading : true }));
    
                const { username } = !query? await getUsername() : '';
                const { data, status } = !query? await axios.get(`http://localhost:8000/seller/user/${username}`) : await axios.get(`http://localhost:8000/seller/${query}`);

                
                if (status === 201) {
                    setData(prev => ({ ...prev, isLoading : false }));
                    setData(prev => ({ ...prev, apiData : data, status : status }));
                }
    
                setData(prev => ({ ...prev, isLoading : false }));
            } catch (error) {
                console.log(error);
                setData(prev => ({ ...prev, isLoading : true, serverError : error, status : 440 }));
            }
        };
        fetchData();
        // console.log("fetch data" + getData);
    }, [query]);

    return [getData, setData];
}