import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Image } from 'cloudinary-react';
import env from '../../config.js';

import useFetch from "../../hooks/fetch.hookBuyer";
import { updateLocation } from '../../helper/helperBuyer';

// import foodicon from '../../assets/foodicon.png';
import usericon from '../../assets/usericon.png';
import logouticon from '../../assets/logouticon.png';

export default function Homebuyer() {
    const [username, setUsername] = useState("");
    const [pos, setPos] = useState({ latitude: null, longitude: null });
    const navigate = useNavigate();

    // get username from token and get data
    const [{ isLoading, apiData, serverError, status }] = useFetch();

    useEffect(() => {
      if (status && status === 201) {
        setUsername(apiData.username);
      }
    }, [status, apiData]);

    useEffect(() => {
      if ("geolocation" in navigator && username) {
          navigator.geolocation.getCurrentPosition((position) => {
              setPos({latitude : position.coords.latitude, longitude : position.coords.longitude});
          });
      }

    }, [username]);

    useEffect(() => {
      if (username && pos) {
          updateLocation({ username : username, location : pos })
          .then((res) => {
              toast.success(res.msg);
              console.log(res);
          })
          .catch((error) => {
              console.log(error);
          })  
      } 
    }, [pos]);  

    function userLogout() {
      localStorage.removeItem('token');
      navigate('/buyer/login');
    }

    function foodList() {
      navigate('/buyer/foodlists');
    }

    function ingredientList() {
      navigate('/buyer/ingredientlists');
    }

    if(status && status !== 201) return navigate('/buyer/register');
    if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

    return (
      <div className="container h-dvh bg-[#EFE5D8]">
        <Toaster position='top-center' reverseOrder={false}></Toaster>

        <div className="header h-1/6 bg-orange-300 flex flex-row justify-around items-center">
            <img className='size-12 rounded-full' alt="usericon" src={usericon}/>
            <h2 className='flex text-3xl text-blue-900'>{apiData?.firstName || "Store"}</h2> 
            <button onClick={userLogout}><img src={logouticon} alt='logout' className='size-10 rounded-full'/></button>
        </div>

        <div className="btn-container flex flex-row justify-center items-center h-1/5 mt-10">
          <div className="food-btn flex justify-center items-center shadow-lg shadow-indigo-500/40 rounded-l-xl h-3/4 w-2/6 bg-green-600">
            <button className="text-xl" onClick={foodList}>Food</button>
          </div>

          <div className="ingredient-btn flex justify-center items-center shadow-lg shadow-indigo-500/40 rounded-r-xl h-3/4 w-2/6 bg-sky-600">
            <button className="text-xl" onClick={ingredientList}>Ingredient</button>
          </div>
        </div>
        
      </div>
    )
}

{/* <Image className='size-10 rounded-full' alt={logouticon}
cloudName={env.CLOUD_NAME}
publicId="logouticon_fjqogj"
/> */}

{/* <Image className='size-12 rounded-full' alt={usericon}
cloudName={env.CLOUD_NAME}
publicId="usericon_xm0foj"
/> */}