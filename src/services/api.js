import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

const getToken = () => localStorage.getItem('token');

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const register = async (email, password, phoneNumber, name) => {
    const response = await api.post('/auth/register', { email, password, phoneNumber, name });
    return response.data;
};

export const getProducts = async () => {
    const response = await api.get('/products');
    console.log("Products API Response:", response.data);
    return response.data;
  };

export const createProduct = async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
};

export const getTransactions = async () => {
    const response = await api.get('/transactions');
    console.log("Transactions API Response:", response.data);
    return response.data;
  };

export const createTransaction = async (userId, productIds, totalAmount) => {
    const response = await api.post('/transactions', { userId, productIds, totalAmount });
    return response.data;
};

export default api;
