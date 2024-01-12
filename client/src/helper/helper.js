import axios from 'axios';
import toast from 'react-hot-toast';
axios.defaults.baseURL = process.env.APP_SERVER_DOMAIN;
export async function authenticate(username) {
    try {
        return await axios.post('seller/register', { username });
    } catch (err) {
        return { err : err };
    }
}

export async function getUser({ username }) {
    try {
        const { data } = await axios.get(`seller/user/${username}`);
        return { data };
    } catch (err) {
        return { err : err };
    }
}

export async function registerUser(information) {
    try {
        const { data : { msg }, status } = await axios.post(`seller/register`, information)
        .then(() => {

        })
        .catch(err => {
            console.log(err);
        });
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
            await axios.post('http://localhost/8000/seller/login', { username, password })
            .then(([data, status]) => {
                console.log(data);
                return Promise.resolve({ data });
            }).catch(err => {
                console.log(err);
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
        const data = await axios.put('seller/updateUser', information, { headers : {"Authorization": `Bearer ${token}`}});

        return Promise.resolve({data});
    } catch (error) {
        return Promise.reject({ error : "Cannot update user" });
    }
}

export async function generateOTP({ username }) {
    try {
        const { data : { code }, status } = await axios.get('seller/generateOTP', { params : { username: username}});
        if (status === 201 ) {
            let { data : email } = await getUser({ username });
            let text = `Your Password Recovery OTP: ${code}`;
            await axios.post('seller/registerMail', { username, userEmail : email, text, subject: "Password recovery "});
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error });
    }
}

export async function verifyOTP({ username, code }) {
    try {
        const { data, status } = await axios.get('seller/verifyOTP', { username, code });
        return {data, status };
    } catch (error) {
        return Promise.reject({ error });
    }
}

export async function resetPassword({ username, password }) {
    try {
        const { data, status } = await axios.put('seller/resetPassword', { username, password });
        return Promise.resolve({ data, status });
    } catch (error) {
        return Promise.reject({ error });
    }
}