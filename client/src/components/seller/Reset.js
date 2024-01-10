import React from 'react'

// error display handlers
import { Toaster } from 'react-hot-toast';

// use with form handlers
import { useFormik } from 'formik';
import { resetPasswordValidate } from '../../helper/validate';


export default function Reset() {

    const formik = useFormik({
        initialValues : {
            password : '',
            confirm_pwd : '',
        },
        validate : resetPasswordValidate, // change to password validation
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
                    <h4 className='text-4xl font-bold'>Reset</h4>
                    <span className='py-4 text-xl text-center text-gray-500'>
                        Enter New Password
                    </span>
                </div>

                <form className='py-2' onSubmit={formik.handleSubmit}>

                    <div className='mt-4 mb-3 textbox flex flex-col justify-center items-center'>
                        <input {...formik.getFieldProps('password')} type='password' placeholder='password' className='shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        <input {...formik.getFieldProps('confirm_pwd')} type='password' placeholder='confirm password' className='shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        <button type='submit' className='p-2 rounded-md shadow-md bg-amber-100 hover:bg-sky-500' style={{width: "80%"}}>Reset</button>
                    </div>
                </form>
            </div>
            
        </div>
    </div>
  )
}
