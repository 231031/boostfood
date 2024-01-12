import { useEffect, useState } from "react";
import axios
 from "axios";
export default function useFetch (query) {
    const [ getData, setData ] = useState({isLoading : false, apiData : undefined, status : null, serverError : null});

    useEffect(() => {
        if (!query) return;

        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading : true }));

                const { data, status } = await axios.get(`http://localhost:8000/seller/${query}`);

                if (status === 201) {
                    setData(prev => ({ ...prev, isLoading : false }));
                    setData(prev => ({ ...prev, apiData : data, status : status }));
                }

                setData(prev => ({ ...prev, isLoading : false }));
            } catch (error) {
                setData(prev => ({ ...prev, isLoading : true, serverError : error }))
            }
        };
        fetchData();
    }, [query]);

    return [getData, setData];
}