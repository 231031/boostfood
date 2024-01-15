import React from 'react'
import { useNavigate } from 'react-router-dom';

// error display handlers
import toast, { Toaster } from 'react-hot-toast';

// use with form handlers
import { useFormik } from 'formik';

import { resetPasswordValidate } from '../../helper/validate';
import { useAuthStore } from '../../store/store';
import  useFetch  from '../../hooks/fetch.hook';
import { resetPassword } from '../../helper/helper';

export default function Reset() {

    const navigate = useNavigate();
    let { username } = useAuthStore(state => state.auth) || '';

    // handle refresh
    if (username !== '') localStorage.setItem('username', username);
    else if (username === '') username = localStorage.getItem('username');
    

    // request to createResetSession then request to reset
    // console.log('createResetSessions');
    const [{ isLoading, apiData, status, serverError }] = useFetch('createResetSessions');


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
            const resetPromise = resetPassword({ username, password : values.password });
            toast.promise(resetPromise, {
                loading : 'Updating...',
                success : 'Update Successfully',
                error : 'Update Failed'
            })

            resetPromise
            .then((res) => {
                localStorage.removeItem('username');
                navigate('/login');
            })
            .catch((error) => {
                localStorage.removeItem('username');
                console.log(error);
                // toast.error(error);
            })
        }

    });

    if(status && status !== 201) return navigate('/register');
    if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>
    // if(status && status !== 201) return <Navigate to={'/login'} replace={true}></Navigate>

    

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
