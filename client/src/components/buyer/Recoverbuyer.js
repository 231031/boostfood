import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// error display handlers
import toast, { Toaster } from 'react-hot-toast';

// use with form handlers
import { useFormik } from 'formik';

import { useAuthStore } from '../../store/store';
import { generateOTP } from '../../helper/helper.js';


export default function Recoverbuyer() {
    const setUsername = useAuthStore(state => state.setUsername);
    const navigate = useNavigate();
    const [user, setUser] = useState("");

    async function onSubmitUser(e) {
        e.preventDefault();
        await setUsername(user);
        generateOTP({username : user})
        .then((OTP) => {
            console.log(OTP)
            if(OTP) toast.success('OTP has been send to your email!'); 
        })
        .catch((error) => {
            console.error(error);
            if (error.error) {
                const errorMessage = error.error.response.data.error;
                toast.error(errorMessage);
              }
        });
    }


    const verify = useFormik({
        initialValues : {
            OTP : '',
        },
        // validate : ,
        validateOnBlur : false,
        validateOnChange : false,
        onSubmit : async values => {
            // console.log(values);
            console.log("user : " + user);
            console.log("OTP : " + values.OTP);
            const code = values.OTP;
            await axios.get('http://localhost:8000/buyer/verifyOTP', { params : { username : user, code }})
            .then(res => {
                toast.success('Verify OTP successfully');
                return navigate("/buyer/reset");
            }).catch((error)=> {
                console.log(error);
                if (error.response) {
                    const errorMsg = error.response.data.error;
                    toast.error(errorMsg);
                }
                
                // console.log('Error post method' + ' ' + error.response.data.error.error);
            })
        }
    })

  return (
    <div className='container mx-auto'>
        <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='bg-cover flex justify-center items-center h-screen' style={{ 
      backgroundImage: `url("https://wallpapercave.com/wp/wp9443731.jpg")`}}>
            <div className='bg-sky-500 p-7 rounded-xl drop-shadow-2xl w-3/4'>
                <div className='title flex flex-col items-center '>
                    <h4 className='text-2xl font-bold'>Recover Password</h4>
                    <span className='py-4 text-center text-gray-300 text-sm'>
                        Enter OTP to Recover Password
                    </span>
                </div>

                <form className='py-2' onSubmit={onSubmitUser}>

                    <div className='textbox flex flex-col justify-center items-center mb-10 '>
                        <span className='text-gray-300'>
                            Enter Username to Confirm
                        </span>
                        <input onChange={(e) => setUser(e.target.value)} type='text' placeholder='username' className='shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        <button type='submit' className='p-2 rounded-md shadow-md bg-amber-100 hover:bg-sky-500' style={{width: "80%"}}>Send</button>
                    </div>
                </form>

                <form className='py-2' onSubmit={verify.handleSubmit}>
                    <div className='textbox flex flex-col justify-center items-center'>
                        <span className='text-gray-500'>
                            Enter 6 digits OTP
                        </span>
                        <input {...verify.getFieldProps('OTP')} type='number' placeholder='OTP'  className='shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        <button type='submit' className='p-2 rounded-md shadow-md bg-amber-100 hover:bg-sky-500' style={{width: "80%"}}>Recover</button>
                    </div>
                </form>
                <div className='text-center mt-4'>
                    <span className='text-gray-500'>Can't get OTP <button onClick={(e) => onSubmitUser(e)} className='text-red-500 cursor-pointer'>Resend</button></span><br/>
                </div>
            </div>
            
        </div>
    </div>
  )
}
