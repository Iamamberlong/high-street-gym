import axios from 'axios';
import { API_URL } from './api'; // Ensure this path is correct

const getAuthToken = () => localStorage.getItem('jwtToken');

export async function login(email, password) {
    try {
        const response = await axios.post(
            `${API_URL}/login`,
            { email, password },
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function logout() {
    const token = getAuthToken();
    console.log('API logout called with token:', token);
    try {
        const response = await axios.post(
            `${API_URL}/logout`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
        console.log("response.data is: ",  response.data)
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getAllUsers() {
    const token = getAuthToken();
    try {
        const response = await axios.get(
            `${API_URL}/users`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data.users;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getUserById(userID) {
    const token = getAuthToken();
    try {
        const response = await axios.get(
            `${API_URL}/users/${userID}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data.user;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}



export async function update(user) {
    const token = getAuthToken();
    try {
        const response = await axios.patch(
            `${API_URL}/users/${user.id}`,
            user,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function create(user) {
    const token = getAuthToken();
    try {
        const response = await axios.post(
            `${API_URL}/users`,
            user,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function deleteByID(userID) {
    const token = getAuthToken();
    try {
        const response = await axios.delete(
            `${API_URL}/users/${userID}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function registerUser(user) {
    try {
        const response = await axios.post(
            `${API_URL}/register`,
            user,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getUserByRole(role) {
    const token = getAuthToken();
    try {
        const response = await axios.get(
            `${API_URL}/users/role/${role}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data.users; // Adjust based on the actual API response
    } catch (error) {
        throw error.response?.data || error.message;
    }
}
