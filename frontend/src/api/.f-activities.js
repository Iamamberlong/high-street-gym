import { API_URL } from "./api.js"

export async function getAll() {
    // GET from the API /animals
    const response = await fetch(
        API_URL + "/activities",
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.activities
}

export async function getByID(activityID) {
    // GET from the API /animal/:id
    const response = await fetch(
        API_URL + "/activities/" + activityID,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.activity
}

export async function create(activity, authenticationKey) {
    const response = await fetch(
        API_URL + "/activities",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
            body: JSON.stringify(activity)
        }
    )

    const postCreateActivityResponse = await response.json()

    return postCreateActivityResponse.activity
}

export async function update(activity, authenticationKey) {
    const response = await fetch(
        API_URL + "/activities",
        {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
            body: JSON.stringify(activity)
        }
    )

    const patchActivityResponse = await response.json()

    return patchActivityResponse.activity
}

export async function remove(activity, authenticationKey) {
    const response = await fetch(
        API_URL + "/activities",
        {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
            body: JSON.stringify(activity)
        }
    )

    const deleteActivityResponse = await response.json()

    return deleteActivityResponse
}