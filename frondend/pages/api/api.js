import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
        "Content-Type": 'application/json'
    }
})


export const getAllProducts = async () => {
    let response;
    try {
        response = await api.get('/api/product/all')
    } catch (error) {
        return error;
    }
    return response;
}

export const getProductById = async (id) => {
    let response;
    try {
        response = await api.get(`/api/product/${id}`)
    } catch (error) {
        return error;
    }
    return response;
}

export const cartUser = async (data) => {
    let response;
    try {
        response = await api.post('/api/cart', data)
    } catch (error) {
        return error;
    }
    return response;
}


export const login = async (data) => {
    let response;
    try {
        response = await api.post('/api/login', data)
    } catch (error) {
        return error;
    }
    return response;
}
