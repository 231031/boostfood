import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
// error display handlers
import { Toaster, toast } from 'react-hot-toast';

// use with form handlers
import { useFormik } from 'formik';
import { usernameValidate } from '../../helper/validate';

import { useAuthStore } from '../../store/store.js';

// import * as api from '../../helper/helper.js';


export default function Username() {
    const [msg, setMsg] = useState("");
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    // access username from every components
    const setUsername = useAuthStore(state => state.setUsername);
    


    const formik = useFormik({
        initialValues : {
            username : '',
            password : '',
        },
        validate : usernameValidate,
        validateOnBlur : false,
        validateOnChange : false,
        onSubmit : async values => {
            setUsername(values.username);
            const username = values.username;
            const password = values.password;
            axios.post('http://localhost:8000/seller/login', { username, password })
            .then((res) => {
                console.log(res);
                setToken(res.data.token);
                setMsg(res.data.msg);
                if (token !== '') {
                    toast.success(msg);
                    navigate('/addfood');
                }
                // return Promise.resolve({ data });
            }).catch(error => {
                const errorMsg = error.response.data.error;
                toast.error(errorMsg);
                console.log(errorMsg);
            });
           
        }
    })
  return (
    <div className='container mx-auto'>
        <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='bg-cover flex justify-center items-center h-screen' style={{ 
      backgroundImage: `url("https://wallpapercave.com/wp/wp9443731.jpg")`}}>
            <div className='bg-lime-500 p-7 rounded-xl drop-shadow-2xl w-3/4'>
                <div className='title flex flex-col items-center '>
                    <h4 className='text-4xl font-bold'>Boost Food</h4>
                    <span className='py-4 text-xl text-center text-gray-500'>
                        Welcome to BoostFood
                    </span>
                </div>

                <form className='py-2' onSubmit={formik.handleSubmit}>

                    <div className='textbox flex flex-col justify-center items-center'>
                        <input {...formik.getFieldProps('username')} type='text' placeholder='username' className='shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        <input {...formik.getFieldProps('password')} type='password' placeholder='password' className='shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        <button type='submit' className='m-1 p-2 rounded-md shadow-md bg-amber-100 hover:bg-sky-500'>Let's Explore BoostFood</button>
                    </div>

                    <div className='text-center mt-4'>
                        <span className='text-gray-500'>Not a Member <Link className='text-red-500 cursor-pointer' to='/register'>Register Now</Link></span><br/>
                        <span className='text-gray-500'>Forget Password <Link className='text-red-500 cursor-pointer' to='/recover'>Recover Now</Link></span>
                    </div>
                </form>
            </div>
            
        </div>
    </div>
  )
}
