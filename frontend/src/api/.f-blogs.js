import { API_URL } from "./api.js";

export async function getAll() {
    const response = await fetch(API_URL + "/blogs", {
        method: "GET",
        headers: {
            'Content-Type': "application/json"
        },
    });

    const APIResponseObject = await response.json();
    return APIResponseObject.blogs; // Ensure your backend responds with 'blogs'
}

export async function getByID(blogID) {
    const response = await fetch(API_URL + "/blogs/" + blogID, {
        method: "GET",
        headers: {
            'Content-Type': "application/json"
        },
    });

    const APIResponseObject = await response.json();
    return APIResponseObject.blog; // Ensure your backend responds with 'blog'
}

export async function create(blog, authenticationKey) {
    const response = await fetch(API_URL + "/blogs", {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            'X-AUTH-KEY': authenticationKey
        },
        body: JSON.stringify(blog)
    });

    const postCreateBlogResponse = await response.json();
    return postCreateBlogResponse.blog; // Ensure your backend responds with 'blog'
}

export async function update(blog, authenticationKey) {
    const response = await fetch(API_URL + "/blogs", {
        method: "PATCH",
        headers: {
            'Content-Type': "application/json",
            'X-AUTH-KEY': authenticationKey
        },
        body: JSON.stringify(blog)
    });

    const patchBlogResponse = await response.json();
    return patchBlogResponse.blog; // Ensure your backend responds with 'blog'
}

export async function remove(blogID, authenticationKey) {
    const response = await fetch(API_URL + "/blogs/" + blogID, {
        method: "DELETE",
        headers: {
            'Content-Type': "application/json",
            'X-AUTH-KEY': authenticationKey
        },
        body: JSON.stringify({})
    });

    const deleteBlogResponse = await response.json();
    return deleteBlogResponse; // Handle the response as needed
}
