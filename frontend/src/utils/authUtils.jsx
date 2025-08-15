import axios from 'axios';
import { getCookie, removeCookie } from './cookieUtils';

// Decode a JWT token payload safely
export const decodeJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

// Check if a JWT is expired (with small skew)
export const isTokenExpired = (token, skewSeconds = 5) => {
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.exp) return false;
    const nowSeconds = Math.floor(Date.now() / 1000);
    return decoded.exp <= (nowSeconds + skewSeconds);
};

// Function to refresh access token using refresh token from cookie
export const refreshAccessToken = async () => {
    try {
        const response = await axios.post('http://localhost:3000/refresh', {}, {
            withCredentials: true
        });
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            return response.data.accessToken;
        }
        return null;
    } catch (error) {
        console.error('Token refresh failed:', error);
        localStorage.removeItem('accessToken');
        removeCookie('refreshToken');
        throw error;
    }
};

// Ensure we have a fresh access token on app load
export const ensureFreshAccessToken = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = getCookie('refreshToken');

    if (!refreshToken) {
        return null;
    }

    if (!accessToken || isTokenExpired(accessToken)) {
        try {
            const newToken = await refreshAccessToken();
            return newToken;
        } catch {
            return null;
        }
    }

    return accessToken;
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = getCookie('refreshToken');
    if (!refreshToken) return false;
    if (!accessToken) return true;
    return !isTokenExpired(accessToken);
};

// Function to logout user
export const logout = () => {
    localStorage.removeItem('accessToken');
    removeCookie('refreshToken');
};

// Function to get access token
export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

// Function to get refresh token
export const getRefreshToken = () => {
    return getCookie('refreshToken');
};
