import axios from 'axios';
import Cookies from 'js-cookie';

import {COOKIES} from '@/utils/constants';

const api = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use((config) => {
    const token = Cookies.get(COOKIES.ACCESS_TOKEN);
    const locale = Cookies.get(COOKIES.LOCALE);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (locale) config.headers['Accept-Language'] = locale;
    return config;
});

api.interceptors.response.use(
    (config) => config,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && error.config && !originalRequest._isRetry) {
            Cookies.remove(COOKIES.ACCESS_TOKEN);
            if (location.pathname !== '/login') location.href = '/login';
        }

        throw error;
    }
);
export {api};
