import axios from 'axios';  
import env from '../config.js';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// import { getUsername } from './helper/helperSeller';

export async function getProduct(username) {

    try {
        const token = localStorage.getItem('token');
        const { data : {foodList, ingredientList} } = await axios.get(`http://localhost:8000/seller/getProduct/${username}`, { headers : { "authorization" : `Bearer ${token}`}});
        return Promise.resolve({ foodList , ingredientList });

    } catch (error) {
        console.log(error);
        return Promise.reject({ error : "Cannot Get Product from DB" });
    }
}

export async function addFood({username, foodDetail}) {

    try {
        const token = localStorage.getItem('token');
        console.log(foodDetail);
        const { data : { msg }, status } = await axios.post(`http://localhost:8000/seller/addFood/${username}`, foodDetail, { headers : { "authorization" : `Bearer ${token}`}});
        return Promise.resolve(msg);

    } catch (error) {
        // console.log(error);
        return Promise.reject({ error });
    }
}

export async function addIngredient({username, ingredientDetail}) {

    try {
        const token = localStorage.getItem('token');
        const { data : { msg }, status } = await axios.post(`http://localhost:8000/seller/addIngredient/${username}`, ingredientDetail, { headers : { "authorization" : `Bearer ${token}`}});
        return Promise.resolve(msg);

    } catch (error) {
        return Promise.reject({ error });
    }
}

export async function imageUpload(file) {
    try {
        const cloudName = env.CLOUD_NAME;
        console.log(cloudName); 
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", env.UPLOAD_PRESET);
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
            method: "POST",
            body: formData,
            }
        );
        const res = await response.json();
        return res.public_id;
    } catch (error) {
        return Promise.reject({ error });
    }
    
   
}

export async function updateLocation({ username, location }) {
    try {
        const token = localStorage.getItem("token");
        console.log(username);
        console.log(token);
        const { data : { msg }, status } = await axios.put(`http://localhost:8000/seller/updatelocation/${username}`, location, { headers : { "authorization" : `Bearer ${token}`}});
    } catch (error) {
        return Promise.reject({ error });
    }

}

