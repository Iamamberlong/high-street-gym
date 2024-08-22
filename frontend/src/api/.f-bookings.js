import { API_URL } from "./api.js"

export async function getAll() {
    // GET from the API /bookings
    const response = await fetch(
        API_URL + "/bookings",
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.bookings
}

export async function getByID(bookingID) {
    // GET from the API /booking/:id
    const response = await fetch(
        API_URL + "/bookings/" + bookingID,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.booking
}

export async function create(booking) {
    const response = await fetch(
        API_URL + "/bookings",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(booking)
        }
    )

    const postCreateBookingResponse = await response.json()

    return postCreateBookingResponse.trail
}

export async function update(booking) {
    const response = await fetch(
        API_URL + "/bookings",
        {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(booking)
        }
    )

    const patchBookingResponse = await response.json()

    return patchBookingResponse.booking
}

export async function remove(booking) {
    const response = await fetch(
        API_URL + "/bookings",
        {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(booking)
        }
    )

    const deleteBookingResponse = await response.json()

    return deleteBookingResponse
}