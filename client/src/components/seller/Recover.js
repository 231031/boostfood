import React from 'react'
// import { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'

// error display handlers
import { Toaster } from 'react-hot-toast';

// use with form handlers
// import { useFormik } from 'formik';
// import { usernameValidate } from '../../helper/validate';

// import style from '../../style/Username.module.css'

export default function Recover() {

  return (
    <div className='container mx-auto'>
        <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='bg-cover flex justify-center items-center h-screen' style={{ 
      backgroundImage: `url("https://wallpapercave.com/wp/wp9443731.jpg")`}}>
            <div className='bg-lime-500 p-7 rounded-xl drop-shadow-2xl w-3/4'>
                <div className='title flex flex-col items-center '>
                    <h4 className='text-2xl font-bold'>Recover Password</h4>
                    <span className='py-4 text-center text-gray-500 text-sm'>
                        Enter OTP to Recover Password
                    </span>
                </div>

                <form className='py-2'>

                    <div className='textbox flex flex-col justify-center items-center'>
                    <span className='text-gray-500'>
                        Enter 6 digits OTP
                    </span>
                        <input type='password' placeholder='OTP' className='shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        <button type='submit' className='m-1 p-2 rounded-md shadow-md bg-amber-100 hover:bg-sky-500' style={{width: "80%"}}>Recover</button>
                    </div>

                    <div className='text-center mt-4'>
                        <span className='text-gray-500'>Can't get OTP <button className='text-red-500 cursor-pointer'>Resend</button></span><br/>
                    </div>
                </form>
            </div>
            
        </div>
    </div>
  )
}
