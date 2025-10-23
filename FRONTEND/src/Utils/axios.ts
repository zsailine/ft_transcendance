import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type" : "application/json"
    }
})

api.interceptors.request.use(
    (conf) =>{
        const token = localStorage.getItem("token")
        if (token)
            conf.headers.Authorization = `Bearer ${token}`
        return conf
    },
    (err) => {
        return Promise.reject(err)
    }
)

api.interceptors.response.use(
    (response) => response,
    (err) => {
        if (err.response?.status === 401)
        {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(err)
    }
)

export default api