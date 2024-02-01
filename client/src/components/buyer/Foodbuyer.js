import React, { useEffect , useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { getNearLocation } from '../../helper/helperBuyer'
import useFetch from "../../hooks/fetch.hookBuyer";

export default function Foodbuyer() {

  const [username, setUsername] = useState("");
  const [pos, setPos] = useState({ latitude: null, longitude: null });
  const navigate = useNavigate();

   // get location from user's location
   const [{ isLoading, apiData, serverError, status }] = useFetch();

   useEffect(() => {
    if (status && status === 201) {
      setUsername(apiData.username);
    }
  }, [status, apiData]);

  useEffect(() => {
    if (username && apiData.location) {
      console.log(apiData);
      const la = apiData.location.coordinates[1]
      const lo = apiData.location.coordinates[0]
      setPos({latitude : la, longitude : lo });
    }
  }, [username, apiData]);

  useEffect(() => {
    if (username && pos) {
      getNearLocation({ username, location : pos })
      .then((res) => {
        console.log(res);
      })
      .catch(({error}) => {
        console.log(error);
      });
    }
  }, [pos]);

  if(status && status !== 201) return navigate('/buyer/homeBuyer');
  if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>


  return (
    <div>Foodbuyer</div>
  )
}
