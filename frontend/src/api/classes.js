import axios from 'axios';
import { API_URL } from './api'; // Ensure this path is correct

export async function getAll() {
    try {
        const response = await axios.get(`${API_URL}/classes`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return {
            classesByDay: response.data.classesByDay,
            mondayOfThisWeek: response.data.mondayOfThisWeek,
            dateOfMonday: response.data.dateOfMonday,
            dateOfSunday: response.data.dateOfSunday
        } // Ensure your backend responds with 'gymClasses'
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getTop(amount) {
    try {
        const response = await axios.get(`${API_URL}/classes/top/${amount}`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data.gymClasses; // Ensure your backend responds with 'gymClasses'
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getByUserID(userID) {
    try {
        const response = await axios.get(`${API_URL}/classes/user/${userID}`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data.gymClasses; // Ensure your backend responds with 'gymClasses'
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getByID(gymClassID) {
    try {
        const response = await axios.get(`${API_URL}/classes/${gymClassID}`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data.gymClass; // Ensure your backend responds with 'gymClass'
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getMyGymClasses(token) {
    try {
        const response = await axios.get(`${API_URL}/my-classes`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        console.log("response.data.blogs: ", response.data.myGymClasses)
        return response.data.myGymClasses
    } catch (error) {
        console.error('Error fetching my blogs using token ', error)
        throw error
    }
}

export async function create(gymClass, token) {
    try {
        const response = await axios.post(
            `${API_URL}/classes`,
            gymClass,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data; // Ensure your backend responds with appropriate data
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function updateGymClass(gymClass, token) {
    try {
        const response = await axios.patch(
            `${API_URL}/classes`,
            gymClass,
            {
                headers: { 
                    'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` }
            }
        );
        return response.data.gymClass; 
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function remove(gymClassID, token) {
    try {
        const response = await axios.delete(
            `${API_URL}/classes/${gymClassID}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data; // Handle the response as needed
    } catch (error) {
        throw error.response?.data || error.message;
    }
}
