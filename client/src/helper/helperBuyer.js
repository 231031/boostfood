import axios from "axios";
import {jwtDecode} from 'jwt-decode';

export async function registerBuyer(information) {
    try {
        const { data : { msg }, status } = await axios.post('http://localhost:8000/buyer/register', information);
        let { username, email } = information;
        if (status === 201) {
            await axios.post(`http://localhost:8000/buyer/registerMail`, { username, userEmail : email})
            .then((msg) => {
                return Promise.resolve(msg);
            }).catch(err => {
                console.log(err);
            })
        }
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

export async function loginBuyer({ username, password }) {
    try {
        axios.post('http://localhost:8000/buyer/login', { username, password })
        .then(({data}) => {
            console.log(data);
            return Promise.resolve({data});
        }).catch(error => {
            console.log(error);
            return Promise.reject(error);
        })
    } catch (error) {
        console.log(error);
        return Promise.reject({error});
    }
    
}

export async function getUsernameBuyer() {

    const token = localStorage.getItem('token');
    if (!token) {
        return Promise.reject("Cannot find token");
    }

    let decode = jwtDecode(token);
    // console.log(decode);
    return decode;
}

export async function getBuyer({ username }) {
    try {
        const { data } = await axios.get(`http://localhost:8000/buyer/user/${username}`);
        return { data };
    } catch (error) {
        return { error };
    }
}

export async function generateOTP({ username }) {
    try {
        console.log(username);  
        const { data : { code }, status } = await axios.get('http://localhost:8000/buyer/generateOTP', { params : { username }});
        if (status === 201 ) {
            let { data : email } = await getBuyer({ username });
            console.log(email);
            let text = `Your Password Recovery OTP: ${code}`;
            await axios.post('http://localhost:8000/buyer/registerMail', { username, userEmail : email, text, subject: "Password recovery "});
        }
        return Promise.resolve(code);
    } catch (error) {
        console.log(error);
        return Promise.reject({ error });
    }
}

export async function resetPasswordBuyer({ username, password }) {
    try {
        const { data, status } = await axios.put('http://localhost:8000/buyer/resetPassword', { username, password });
        return Promise.resolve({ data, status });
    } catch (error) {
        return Promise.reject({ error });
    }
}

// TODO: 
export async function updateLocation({ username, location  }) {
    try {
        const token = localStorage.getItem('token');
        const { data : { msg }, status } = await axios.put(`http://localhost:8000/buyer/updatelocation/${username}`, location, { headers : { "authorization" : `Bearer ${token}`}});
        return Promise.resolve({ msg, status });
    } catch (error) {
        return Promise.reject({ error });
    }
}

export async function getNearLocation({ username, location }) {
    try {
        const token = localStorage.getItem('token');
        const { data, status } = await axios.post(`http://localhost:8000/buyer/getnearlocation/${username}`, location, { headers : { "authorization" : `Bearer ${token}`}});
        return Promise.resolve({ data, status });
    } catch (error) {
        return Promise.reject({ error });
    }
}