import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});


export const adminLogin = async (data) => {
    let response;
    try {
        response = await api.post('/api/admin-login', data);
    } catch (error) {
        return error;
    }
    return response;
}

export const adminLogout = async () => {
    let response;
    try {
        response = await api.post('/api/logout');
    } catch (error) {
        return error;
    }
    return response;
}

export const getAllUsersInfo = async () => {
    let response;
    try {
        response = await api.get('/api/users/all');
    } catch (error) {
        return error;
    }
    return response;
}

export const block = async (id) => {
    let response;
    try {
        response = await api.put(`/api/user/block/${id}`);
    } catch (error) {
        return error;
    }
    return response;
}

export const unBlock = async (id) => {
    let response;
    try {
        response = await api.put(`/api/user/unblock/${id}`);
    } catch (error) {
        return error;
    }
    return response;
}

export const getAllProducts = async () => {
    let response;
    try {
        response = await api.get(`/api/product/all`);
    } catch (error) {
        return error;
    }
    return response;
}


export const deleteProduct = async (id) => {
    let response;
    try {
        response = await api.delete(`/api/product/${id}`);
    } catch (error) {
        return error;
    }
    return response;
}


export const createProduct = async (data) => {
    let response;
    try {
        response = await api.post("/api/product/create", data);
    } catch (error) {
        return error;
    }
    return response;
}


export const getCategory = async () => {
    let response;
    try {
        response = await api.get("/api/category/all");
    } catch (error) {
        return error;
    }
    return response;
}
export const getCategoryById = async (id) => {
    let response;
    try {
        response = await api.get(`/api/category/${id}`);
    } catch (error) {
        return error;
    }
    return response;
}

export const updateCategory = async (data) => {
    let response;
    try {
        response = await api.put('/api/category/update', data)
    } catch (error) {
        return error;
    }
    return response;
}

export const deleteCategory = async (id) => {
    let response;
    try {
        response = await api.delete(`/api/category/${id}`);
    } catch (error) {
        return error;
    }
    return response;
}

export const getBrand = async () => {
    let response;
    try {
        response = await api.get("/api/brand/all");
    } catch (error) {
        return error;
    }
    return response;
}

export const deleteBrand = async (id) => {
    let response;
    try {
        response = await api.delete(`/api/brand/${id}`);
    } catch (error) {
        return error;
    }
    return response;
}

export const getProduct = async (id) => {
    let response;
    try {
        response = await api.get(`/api/product/${id}`);
    } catch (error) {
        return error;
    }
    return response;
}

export const updateProduct = async (data) => {
    let response;
    try {
        response = await api.put('/api/product/update', data);
    } catch (error) {
        return error;
    }
    return response;
}

export const createCategory = async (data) => {
    let response;
    try {
        response = await api.post('/api/category/create', data);
    } catch (error) {
        return error;
    }
    return response;
}

export const createBrand = async (data) => {
    let response;
    try {
        response = await api.post('/api/brand/create', data);
    } catch (error) {
        return error;
    }
    return response;
}

export const createColor = async (data) => {
    let response;
    try {
        response = await api.post('/api/color/create', data);
        console.log(response, 'color added successfully')
    } catch (error) {
        console.log(error, 'color added successfully')
        return error;
    }
    return response;
}

export const getColors = async () => {
    let response;
    try {
        response = await api.get('/api/color/all');
    } catch (error) {
        return error;
    }
    return response;
}

export const getColor = async (id) => {
    let response;
    try {
        response = await api.get(`/api/color/${id}`);
    } catch (error) {
        return error;
    }
    return response;
}

export const updateColor = async (data) => {
    let response;
    try {
        response = await api.put('/api/color/update', data);
    } catch (error) {
        return error;
    }
    return response;
}

export const deleteColor = async (id) => {
    let response;
    try {
        response = await api.delete(`/api/color/${id}`);
    } catch (error) {
        return error;
    }
    return response;
}


export const updateBrand = async (data) => {
    let response;
    try {
        response = await api.put('/api/brand/update', data);
    } catch (error) {
        return error;
    }
    return response;
}

export const getBrandById = async (id) => {
    let response;
    try {
        response = await api.get(`/api/brand/${id}`);
    } catch (error) {
        return error;
    }
    return response;
}