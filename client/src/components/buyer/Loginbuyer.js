import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
// error display handlers
import { Toaster, toast } from 'react-hot-toast';

// use with form handlers
import { useFormik } from 'formik';
import { usernameValidate } from '../../helper/validate';

import { useAuthStore } from '../../store/store.js';
import { loginBuyer } from '../../helper/helperBuyer.js';


export default function Loginbuyer() {
    const navigate = useNavigate();

    // const token = localStorage.getItem('token') || '';
    // if (token === '') navigate('/homeseller');

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

            axios.post('http://localhost:8000/buyer/login', { username, password })
            .then((res) => {
                console.log(res);
                const token = res.data.token;
                const msg = res.data.msg;
                if (token !== '') {
                    localStorage.setItem('token', token);
                    toast.success(msg);
                    navigate('/buyer/homebuyer');
                }
            }).catch(error => {
                console.log(error);
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    if (typeof errorMessage !== 'object')   toast.error(errorMessage);
                }
               
                // console.log(errorMsg);
            });


           
        }
    })
  return (
    <div className='container mx-auto'>
        <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='bg-cover flex justify-center items-center h-screen' style={{ 
      backgroundImage: `url("https://wallpapercave.com/wp/wp9443731.jpg")`}}>
            <div className='bg-sky-700 p-7 rounded-xl drop-shadow-2xl w-3/4'>
                <div className='title flex flex-col items-center '>
                    <h4 className='text-4xl font-bold'>Boost Food</h4>
                    <span className='py-4 text-xl text-center text-gray-300'>
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
                        <span className='text-gray-300'>Not a Member ? <Link className='text-red-300 cursor-pointer' to='/buyer/register'>Register Now</Link></span><br/>
                        <span className='text-gray-300'>Forget Password ? <Link className='text-red-300 cursor-pointer' to='/buyer/recover'>Recover Now</Link></span>
                    </div>
                </form>
            </div>
            
        </div>
    </div>
  )
}
