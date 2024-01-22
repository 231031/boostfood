import axios from 'axios';
import {jwtDecode} from 'jwt-decode';


export async function getUsername() {

    const token = localStorage.getItem('token');
    if (!token) {
        return Promise.reject("Cannot find token");
    }

    let decode = jwtDecode(token);
    console.log(decode);
    return decode;
}

// export async function authenticate(username) {
//     try {
//         return await axios.post('http://localhost:8000/seller/register', { username });
//     } catch (err) {
//         return { err : err };
//     }
// }

export async function getUser({ username }) {
    try {
        const { data } = await axios.get(`http://localhost:8000/seller/user/${username}`);
        return { data };
    } catch (err) {
        return { err : err };
    }
}

export async function registerUser(information) {
    try {
        const { data : { msg }, status } = await axios.post(`http://localhost:8000/seller/register`, information)
        let { username, email } = information;
        if (status === 201) {
            await axios.post(`seller/registerMail`, { username, userEmail : email})
            .then(() => {
                return Promise.resolve(msg);
            }).catch(err => {
                console.log(err);
            })
        }
        

    } catch (error) {
        return Promise.reject(error);
    }
}

export async function loginUser({ username, password }) {
    try {
        console.log(username);
        if (username) {
            axios.post('http://localhost:8000/seller/login', { username, password })
            .then(({data}) => {
                console.log(data);
                return Promise.resolve({ data });
            }).catch(error => {
                console.log(error);
                return Promise.reject(error);
            });
            
        }
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

export async function updateUser(information) {
    try {
        const token = localStorage.getItem(token);
        const data = await axios.put('http://localhost:8000/seller/updateUser', information, { headers : {"Authorization": `Bearer ${token}`}});

        return Promise.resolve({data});
    } catch (error) {
        return Promise.reject({ error : "Cannot update user" });
    }
}

export async function generateOTP({ username }) {
    try {
        console.log(username);  
        const { data : { code }, status } = await axios.get('http://localhost:8000/seller/generateOTP', { params : { username }});
        if (status === 201 ) {
            let { data : email } = await getUser({ username });
            console.log(email);
            let text = `Your Password Recovery OTP: ${code}`;
            await axios.post('http://localhost:8000/seller/registerMail', { username, userEmail : email, text, subject: "Password recovery "});
        }
        return Promise.resolve(code);
    } catch (error) {
        console.log(error);
        return Promise.reject({ error });
    }
}

export async function verifyOTP({ username, code }) {
    try {
        const { data, status } = await axios.get('http://localhost:8000/seller/verifyOTP', { params : { username, code }});
        return {data, status };
    } catch (error) {
        return Promise.reject({ error });
    }
}

export async function resetPassword({ username, password }) {
    try {
        const { data, status } = await axios.put('http://localhost:8000/seller/resetPassword', { username, password });
        return Promise.resolve({ data, status });
    } catch (error) {
        return Promise.reject({ error });
    }
}