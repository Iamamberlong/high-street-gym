import { API_URL } from "./api.js"

// because class is a reserved word, therefore, in this project, i will use gymClass to refer to class.

export async function getAll() {
    // GET from the API /gymClasses
    const response = await fetch(
        API_URL + "/gymClasses",
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.gymClasses
}

export async function getTop(amount) {
    // GET from the API /sightings
    const response = await fetch(
        API_URL + "/classes/top/" + amount,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.gymClasses
}

export async function getByUserID(userID) {
    // GET from the API /sightings/user-id/:id
    const response = await fetch(
        API_URL + "/gymClasses/user/" + userID,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.gymClasses
}

export async function getByID(gymClassID) {
    // GET from the API /sighting/:id
    const response = await fetch(
        API_URL + "/gymClasses/" + gymClassID,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.gymClass
}

export async function create(gymClass, authenticationKey) {
    const response = await fetch(
        API_URL + "/gymClasses",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
            body: JSON.stringify(gymClass)
        }
    )

    const postCreateGymClassResponse = await response.json()

    return postCreateGymClassResponse
}

// the reference project said Not implemented yet,but i will just try to implement this.
export async function updateGymClass(gymClass) {
    const response = await fetch(
        API_URL + "/sightings",
        {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(gymClass)
        }
    )

    const patchGymClassResponse = await response.json()

    return patchGymClassResponse.gymClass
}

export async function remove(gymClass, authenticationKey) {
    const response = await fetch(
        API_URL + "/gymClasses/" + gymClass.id,
        {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
            body: JSON.stringify(gymClass)
        }
    )

    const deleteGymClassResponse = await response.json()

    return deleteGymClassResponse
}

