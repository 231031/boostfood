import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';

import convertToBase64 from '../../helper/convert';
import { addFoodValidate } from '../../helper/validate';
import uploadFood from '../../assets/uploadFood.png';

import useFetch from '../../hooks/fetch.hook.js';
import { useAuthStore } from '../../store/store';

export default function Addfood() {

    // const { username } = useAuthStore(state => state.auth);

    // get user data
    // const [{ isLoading, apiData, serverError }] = useFetch(`/users/${username}`);

    const [file, setFile] = useState();

    const formik = useFormik({
        initialValues : {
            store: '',
            food : '',
            price : '',
            disprice : '',
            amount : '',
        },
        validate : addFoodValidate,
        validateOnBlur : false,
        validateOnChange : false,
        onSubmit : async values => {
            // create new property inside values object
            values = Object.assign(values, {foodImage : file} || '');
            console.log(values);
        }
    })

    // if (isLoading) return <h1 className='text-md font-bold'>isLoading</h1>
    // if (serverError) return <h1 className='text-md text-red-500'>{serverError.message}</h1>

    // formik not support upload files
    const onUpload = async (e) => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64);
    }
  return (
    <div className='container mx-auto'>
        <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='bg-cover flex justify-center items-center h-screen' style={{ 
      backgroundImage: `url("https://wallpapercave.com/wp/wp9443731.jpg")`}}>
            <div className='bg-lime-500 p-7 rounded-xl drop-shadow-2xl w-4/5'>
                <div className='title flex flex-col items-center '>
                    <h4 className='text-4xl font-bold'>Boost Food</h4>
                    <span className='py-4 text-xl text-center text-gray-500'>
                        Welcome to BoostFood
                    </span>
                </div>

                <form className='py-2' onSubmit={formik.handleSubmit} >
                    <div className='flex flex-col items-center py-3'>
                        <label htmlFor='foodImage'>
                            <img src={file || uploadFood} className='rounded-full w-20 h-20'></img>
                        </label>
                        <input type='file' onChange={onUpload} id='foodImage' name='foodImage' className='invisible'></input>
                    </div>

                    <div className='textbox flex flex-col justify-center items-center'>
                        <input {...formik.getFieldProps('food')} type='text' placeholder='Food Name' className='shadow-md rounded-md w-5/6 text-lg' required></input><br/>
                        <input {...formik.getFieldProps('price')} type='text' placeholder='Price' className='shadow-md rounded-md w-5/6 text-lg' required></input><br/>
                        <input {...formik.getFieldProps('disprice')} type='text' placeholder='Discounted Price' className='shadow-md rounded-md w-5/6 text-lg' required></input><br/>
                        <input {...formik.getFieldProps('amount')} type='number' placeholder='Amount' className='shadow-md rounded-md w-5/6 text-lg' required></input><br/>
                        <button type='submit' className='m-1 p-2 rounded-md shadow-md bg-amber-100 hover:bg-sky-500' style={{width: "80%"}}>Add Food</button>
                    </div>
                </form>
            </div>
            
        </div>
    </div>
  )
}
