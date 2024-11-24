import axios from 'axios';

const API_URL = 'https://frayogisitorustestrimbabe-production.up.railway.app/api';
// const API_URL = 'http://localhost:4000/api';

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
  (error) => Promise.reject(error)
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
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const getTransactions = async () => {
  const response = await api.get('/transactions');
  return response.data;
};

export const createTransaction = async (userId, requestBody) => {
  try {
    const response = await api.post('/transactions', { userId, ...requestBody });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSummary = async () => {
  const response = await api.get('/transactions/summary');
  return response.data;
};

export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;  // Make sure to throw if there's an error
  }
};


export default api;
