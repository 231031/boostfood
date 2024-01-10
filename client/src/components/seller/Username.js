import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// error display handlers
import { Toaster } from 'react-hot-toast';

// use with form handlers
import { useFormik } from 'formik';
import { usernameValidate } from '../../helper/validate';

// import style from '../../style/Username.module.css'

export default function Username() {

    const formik = useFormik({
        initialValues : {
            username : '',
            password : '',
        },
        validate : usernameValidate,
        validateOnBlur : false,
        validateOnChange : false,
        onSubmit : async values => {
            console.log(values);
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
