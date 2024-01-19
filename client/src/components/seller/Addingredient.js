import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';

import convertToBase64 from '../../helper/convert';
import { addIngredientValidate } from '../../helper/validate';
import { addIngredient, imageUpload } from '../../helper/helperSeller.js';
import uploadFood from '../../assets/uploadFood.png';
import useFetch from '../../hooks/fetch.hook.js';

import homeicon from '../../assets/homeicon.png';


export default function Addingredient() {

    // get user data
    const [{ isLoading, apiData, status, serverError }] = useFetch();
    const navigate = useNavigate();

    const [file, setFile] = useState();
    const formik = useFormik({
        initialValues : {
            ingredientname : '',
            price : '',
            discountedPrice : '',
            category : '',
            stock : '',
            pic : '',
        },
        validate : addIngredientValidate,
        validateOnBlur : false,
        validateOnChange : false,
        onSubmit : async values => {
            // create new property inside values object
            values = Object.assign(values, {pic : file} || '');

            // upload image to cloud and get url to access it
            if (file !== undefined) {
                const data = await imageUpload(file);
                console.log(data);
                values.pic = data;
            }
            

            addIngredient({username : apiData.username, ingredientDetail: values})
            .then((res) => {
                toast.success(res);
            })
            .catch((error) => {
                console.log(error);
            });


        }
    })

    if(status && status !== 201) return navigate('/register');
    if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

    // formik not support upload files
    const onUpload = async (e) => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64);
    }

    function onClickHome() {
        navigate('/homeseller');
    }

  return (
    <div className='container h-dvh' style={{ 
        backgroundImage: `url("https://wallpapercave.com/wp/wp9443731.jpg")`}}>
        <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='btn-home absolute flex justify-end  ml-7 mt-7'>
            <button className='btn-home' onClick={onClickHome}><img className='w-12 h-12' src={homeicon} alt='home icon'/></button>
        </div>
        <div className=' flex flex-col justify-center items-center  h-screen' >
            
            <div className='bg-lime-500 p-7 rounded-xl drop-shadow-2xl w-4/5'>
                <div className='title flex flex-col items-center '>
                    <h4 className='text-4xl font-bold'>Boost Food</h4>
                    <span className='py-4 text-xl text-center text-gray-500'>
                        Welcome {apiData?.firstName}
                    </span>
                </div>

                <form className='py-2' onSubmit={formik.handleSubmit} >
                    <div className='flex flex-col items-center py-3'>
                        <label htmlFor='pic'>
                            <img src={file || uploadFood} className='rounded-full w-20 h-20'></img>
                        </label>
                        <input type='file' onChange={onUpload} id='pic' name='pic' className='invisible'></input>
                    </div>

                    <div className='textbox flex flex-col justify-center items-center'>
                        <input {...formik.getFieldProps('ingredientname')} type='text' placeholder='Ingredient Name' className='shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        <input {...formik.getFieldProps('price')} type='text' placeholder='Price' className='shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        <input {...formik.getFieldProps('discountedPrice')} type='text' placeholder='Discounted Price' className='shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        {/* <input {...formik.getFieldProps('category')} type='text' placeholder='Category' className='shadow-md rounded-md w-5/6 text-lg'></input><br/> */}
                        <select {...formik.getFieldProps('category')} className='rounded-md shadow-md w-5/6 text-lg'>
                            <option value="">Select Category</option>
                            <option value="vegetable">Vegetable</option>
                            <option value="meat">Meat</option>
                        </select>
                        <input {...formik.getFieldProps('stock')} type='number' placeholder='Stock' className='mt-7 shadow-md rounded-md w-5/6 text-lg'></input><br/>
                        <button type='submit' className='m-1 p-2 rounded-md shadow-md bg-amber-100 hover:bg-sky-500 w-5/6'>Add Food</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}
