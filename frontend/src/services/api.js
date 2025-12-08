import axios from 'axios';

// Em vez de apontar para localhost:8000, apontamos para o "caminho relativo"
// O Ingress (na nuvem) ou o Vite (local) vão redirecionar isso para o lugar certo.

const catalogAPI = axios.create({
  baseURL: '/api/catalog', // Era http://localhost:8000
  headers: {
    'Content-Type': 'application/json',
  },
});

const orderAPI = axios.create({
  baseURL: '/api/order',   // Era http://localhost:8002
  headers: {
    'Content-Type': 'application/json',
  },
});

// O resto continua igualzinho...
export const catalogService = {
  getProducts: async () => {
    // Agora o navegador vai chamar: meudominio.com/api/catalog/products/
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