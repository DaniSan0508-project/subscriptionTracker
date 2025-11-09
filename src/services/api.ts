import axios, { AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.0.11:8090/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
        // Don't add token for login or register endpoints
        if (config.url && (config.url === '/login' || config.url === '/register')) {
            return config;
        }

        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            if (!config.headers) {
                config.headers = {};
            }
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;