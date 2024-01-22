import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from "react-hot-toast"; // handles warning messages

// error display handlers
import { Toaster } from 'react-hot-toast';

// use with form handlers
import { useFormik } from 'formik';
import { registerBuyerValidate } from '../../helper/validate';

import { registerBuyer } from '../../helper/helperBuyer.js';

export default function Registerbuyer() {

    const navigate = useNavigate();
    // const token = localStorage.getItem('token');
    // console.log(token);

    
    // if (token !== '') navigate('/homeseller');

    


    const formik = useFormik({
        initialValues : {
            firstName : '',
            lastName : '',
            email : '',
            tel : '',
            username : '',
            password : '',
        },
        validate : registerBuyerValidate,
        validateOnBlur : false,
        validateOnChange : false,
        onSubmit : async values => {
            const registerPromise = registerBuyer(values);
            toast.promise(registerPromise, {
                loading : 'Creating...',
                success : 'Successfully registered',
                error : 'Wrong registration'
            })
            registerPromise
            .then(function(){ navigate('/buyer/login')})
            .catch((error) => { 
                if (error.response) {
                    toast.error(error.response.data.error.error)}
                })
        }
    })
  return (
    <div className='container mx-auto'>
        <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='bg-cover flex justify-center items-center h-screen' style={{ 
      backgroundImage: `url("https://wallpapercave.com/wp/wp9443731.jpg")`}}>
            <div className='p-7 rounded-xl drop-shadow-2xl w-3/4 bg-sky-700'>
                <div className='title flex flex-col items-center '>
                    <h4 className='text-4xl font-bold'>Boost Food</h4>
                    <span className='py-4 text-xl text-center text-gray-300'>
                        Welcome to BoostFood
                    </span>
                </div>

                <form className='py-2' onSubmit={formik.handleSubmit} >
                    <div className='textbox flex flex-col justify-center items-center'>
                        <input {...formik.getFieldProps('username')} type='text' placeholder='username' className='shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        <input {...formik.getFieldProps('password')} type='password' placeholder='password' className='shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        <input {...formik.getFieldProps('firstName')} type='text' placeholder='First Name' className='shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        <input {...formik.getFieldProps('lastName')} type='text' placeholder='Last Name' className='shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        <input {...formik.getFieldProps('email')} type='text' placeholder='email' className='shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        <input {...formik.getFieldProps('tel')} type='number' placeholder='telephone number' className='shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        <button type='submit' className='m-1 p-2 rounded-md shadow-md bg-amber-100 hover:bg-sky-500' style={{width: "80%"}}>Sign Up</button>
                    </div>

                    {/* link to login page */}
                    <div className='text-center mt-4'>
                        <span className='text-gray-300'>Already Register ? <Link className='text-red-300 cursor-pointer' to='/buyer/login'>Login</Link></span><br/>
                    </div>
                </form>
            </div>
            
        </div>
    </div>
  )
}
