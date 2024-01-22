import axios from "axios";

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
        return Promise.reject(error);
    }
    
}