import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('AUTH_TOKEN') //Obtenemos el JWT almacenado en el localStorage

    if (token) {
       config.headers.Authorization = `Bearer ${token}` //Inicia con Bearer si o si     
    }

    return config
    
})

export default api