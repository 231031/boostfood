import axios from 'axios';

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
        const { data : { msg }, status } = await axios.post(`seller/register`, information);
        let { username, email } = information;
        if (status === 201) {
            await axios.post(`seller/registerMail`, { username, userEmail : email});
        }
        return Promise.resolve(msg);

    } catch (error) {
        return Promise.reject(error);
    }
}

export async function loginUser({ username, password }) {
    try {
        if (username) {
            const { data } = await axios.post(`seller/login`, { username, password });
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error : "Password is incorrect"});
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