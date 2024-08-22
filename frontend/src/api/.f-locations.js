import { API_URL } from "./api.js";

// Fetch all locations
export async function getAll() {
    const response = await fetch(API_URL + "/locations", {
        method: "GET",
        headers: {
            'Content-Type': "application/json"
        },
    });

    const APIResponseObject = await response.json();
    return APIResponseObject.locations; // Ensure your backend responds with 'locations'
}

// Fetch a single location by its ID
export async function getByID(locationID) {
    const response = await fetch(API_URL + "/locations/" + locationID, {
        method: "GET",
        headers: {
            'Content-Type': "application/json"
        },
    });

    const APIResponseObject = await response.json();
    return APIResponseObject.location; // Ensure your backend responds with 'location'
}

// Create a new location
export async function create(location, authenticationKey) {
    const response = await fetch(API_URL + "/locations", {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            'X-AUTH-KEY': authenticationKey
        },
        body: JSON.stringify(location)
    });

    const postCreateLocationResponse = await response.json();
    return postCreateLocationResponse.location; // Ensure your backend responds with 'location'
}

// Update an existing location
export async function update(location, authenticationKey) {
    const response = await fetch(API_URL + "/locations/" + location.id, {
        method: "PATCH",
        headers: {
            'Content-Type': "application/json",
            'X-AUTH-KEY': authenticationKey
        },
        body: JSON.stringify(location)
    });

    const patchLocationResponse = await response.json();
    return patchLocationResponse.location; // Ensure your backend responds with 'location'
}

// Remove a location by its ID
export async function remove(locationID, authenticationKey) {
    const response = await fetch(API_URL + "/locations/" + locationID, {
        method: "DELETE",
        headers: {
            'Content-Type': "application/json",
            'X-AUTH-KEY': authenticationKey
        },
        body: JSON.stringify({})
    });

    const deleteLocationResponse = await response.json();
    return deleteLocationResponse; // Handle the response as needed
}
