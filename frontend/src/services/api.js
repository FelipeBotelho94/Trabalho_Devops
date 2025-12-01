import axios from 'axios';

const catalogAPI = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

const orderAPI = axios.create({
  baseURL: 'http://localhost:8002',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Catalog Service APIs
export const catalogService = {
  getProducts: async () => {
    const response = await catalogAPI.get('/products/');
    return response.data;
  },

  createProduct: async (product) => {
    const response = await catalogAPI.post('/products/', product);
    return response.data;
  },

  healthCheck: async () => {
    const response = await catalogAPI.get('/');
    return response.data;
  },
};

// Order Service APIs
export const orderService = {
  createOrder: async (order) => {
    const response = await orderAPI.post('/orders', order);
    return response.data;
  },

  getQueue: async () => {
    const response = await orderAPI.get('/orders/queue');
    return response.data;
  },

  healthCheck: async () => {
    const response = await orderAPI.get('/');
    return response.data;
  },
};

