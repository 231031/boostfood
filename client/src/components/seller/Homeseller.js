import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Image } from 'cloudinary-react';
import toast, { Toaster } from 'react-hot-toast';

import { useAuthStore } from '../../store/store';
import  useFetch  from '../../hooks/fetch.hook';
import { getUsername } from '../../helper/helper';
import { getProduct } from '../../helper/helperSeller';
import env from '../../config.js';

import foodicon from '../../assets/foodicon.png';
import usericon from '../../assets/usericon.png';
import logouticon from '../../assets/logouticon.png';



export default function Homeseller() {

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [foodList, setFoodList] = useState({});
    const [ingredientList, setIngredientList] = useState({});
    const [haveFood, setHaveFood] = useState(false);
    const [haveIngredient, setHaveIngredient] = useState(false);


    // get username from token and get data
    const [{ isLoading, apiData, serverError, status }] = useFetch();

    useEffect(() => {
        if (status && (status === 201)) {
            setUsername(apiData.username);
        }
    }, [status, apiData]);

    useEffect(() => {
        if (username) {
            getProduct(username)
                .then((res) => {
                    setFoodList(res.foodList);
                    if (res.foodList.length > 0) {
                        setHaveFood(true);
                    }
                    setIngredientList(res.ingredientList);
                    if (res.ingredientList.length > 0) {
                        setHaveIngredient(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    if (error.response) toast.error(error.response.data.error);
                });
        }
    }, [username]);


    function userLogout() {
        localStorage.removeItem('token');
        navigate('/login');
    }

    function btnFood() {
        navigate('/addFood');
    }

    function btnIngredient() {
        navigate('/addIngredient');
    }

    if(status && status !== 201) return navigate('/register');
    if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className='container h-dvh bg-[#EFE5D8]'>
        <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='header flex flex-row items-center justify-around h-24'>
            <img src={usericon} alt='store icon' className='size-12 rounded-full'/>
            <h2 className='flex text-3xl text-blue-900'>{apiData?.firstName || "Store"}</h2> 
            <button onClick={userLogout}><img src={logouticon} alt='logout' className='size-10 rounded-full'/></button>
        </div>

        <div className='bar bg-slate-300 flex flex-row justify-between items-center '>
            <h3 className='ml-7 text-2xl text-blue-900'>{apiData?.username || "username"}</h3>
            <div className='btn-all flex flex-col items-center my-3 mr-3'>
                <p className='text-xl'>Add Product</p>
                <div className='btn flex mr-3 my-3'>
                <div className='flex flex-col justify-center items-center mr-4'>
                    <button className='addfood' onClick={btnFood}><img className='size-12 rounded-full' src={foodicon} alt='btn-food'/></button>
                    <p className='text-sm'>food</p>
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <button className='addingredient' onClick={btnIngredient}><img className='size-12 rounded-full' src={foodicon} alt='btn-ingredient'/></button>
                    <p className='text-sm'>Ingredient</p>
                </div>    
            </div>
            </div>
        </div>
        
        
        {
            haveFood? (
                <div className='food-container flex flex-col justify-center h-72'>
                    <h3 className='ml-7 text-xl text-blue-900'>Discounted Food</h3>
                    <div className='food-lists flex mx-9 my-4  w-auto overflow-visible overflow-x-auto '>
                    {
                        foodList.map((foodItem, index) => (
                            <div key={index} className='food flex flex-col flex-shrink-0 h-52 w-40 bg-slate-800 rounded-xl mr-3'>
                                {
                                    foodItem.pic? (
                                        <Image className='rounded-xl mx-3 my-3 w-33 h-28' alt={foodItem.foodname}
                                            cloudName={env.CLOUD_NAME}
                                            publicId={foodItem.pic}
                                        />
                                    ) : (
                                        <img className='rounded-xl mx-3 my-3 w-33 h-28' src={foodicon} alt={foodItem.foodname}/>
                                    )
                                }

                                <div className='food-detail flex flex-col text-white mx-4'>
                                    <p className='text-xs flex justify-end text-red-500'>{foodItem.discountedPrice}</p>
                                    <div className='food-name-price flex flex-row justify-between'>
                                        <p>{foodItem.foodname}</p>
                                        <p className='line-through'>{foodItem.price}</p>
                                    </div>
                                    <div className='food-amount flex flex-row justify-between'>
                                        <p>{"stock"}</p>
                                        <p>{foodItem.stock}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                </div>
            ) : (
                <div className='food-container my-5 h-72'>
                    <h3 className='ml-7 text-xl text-blue-900'>Discounted Food</h3>
                    <h2 className='my-4 ml-7 text-md text-blue-600 flex justify-center'>Not Have Discounted Food Now</h2>
                </div>
            )
        }

        {
            haveIngredient? (
                <div className='ingredient-container flex flex-col justify-center h-72 bg-blue-200'>
                    <h3 className='ml-7 text-xl text-blue-900'>Discounted Ingredient</h3>
                    <div className='ingredient-lists flex mx-9 my-4  w-auto overflow-visible overflow-x-auto'>
                    {
                        ingredientList.map((IngredientItem, index) => (
                            <div key={index} className='ingredient flex flex-col flex-shrink-0 h-52 w-40 bg-slate-800 rounded-xl mr-3'>
                                {
                                    IngredientItem.pic? (
                                        <Image className='rounded-xl mx-3 my-3 w-33 h-28' alt={IngredientItem.ingredientname}
                                            cloudName={env.CLOUD_NAME}
                                            publicId={IngredientItem.pic}
                                        />
                                    ) : (
                                        <img className='rounded-xl mx-3 my-3 w-33 h-28' src={foodicon} alt={IngredientItem.ingredientname}/>
                                    )
                                    
                                }
                                <div className='ingredient-detail flex flex-col text-white mx-4'>
                                    <p className='text-xs flex justify-end text-red-500'>{IngredientItem.discountedPrice}</p>
                                    <div className='ingredient-name-price flex flex-row justify-between'>
                                        <p>{IngredientItem.ingredientname}</p>
                                        <p className='line-through'>{IngredientItem.price}</p>
                                    </div>
                                    <div className='ingredient-amount flex flex-row justify-between'>
                                        <p>{"stock"}</p>
                                        <p>{IngredientItem.stock}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                </div>
            ) : (
                <div className='ingredient-container my-4 h-72 bg-blue-200'>
                    <h3 className='ml-7 pt-4 text-xl text-blue-900'>Discounted Ingredient</h3>
                    <h2 className='ml-7 my-4 text-md text-blue-600 flex justify-center'>Not Have Discounted Ingredient Now</h2>
                </div>
            )
        }






    </div>
  )
}
