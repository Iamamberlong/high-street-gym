import { useRef, useState } from "react"
import { API_URL } from "../../api/api"
import { useAuthentication } from "../authentication"
import axios from "axios"

export function XMLUploader({ onUploadSuccess, uploadUrl, disabled = false }) {
    const [user] = useAuthentication()
    console.log('User in the XMLUploader: ', user)

    const [statusMessage, setStatusMessage] = useState("")

    // useRef is the react way of getting an element reference like below:
    // const uploadInput = document.getElementById("file-input")
    const uploadInputRef = useRef(null);

    async function uploadFile(e) {
        e.preventDefault()

        // Files is an array because the user could select multiple files
        // we choose to upload only the first selected file in this case.
        const file = uploadInputRef.current.files[0];

        // Fetch expects multi-part form data to be provided
        // inside a FormData object.  
        const formData = new FormData()
        formData.append("xml-file", file)

        const token = localStorage.getItem("jwtToken");

        fetch(API_URL + uploadUrl,
            {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            })
            .then(res => res.json())
            .then(APIResponse => {
                setStatusMessage(APIResponse.message)
                // clear the selected file
                uploadInputRef.current.value = null
                // Notify of successful upload
                if (typeof onUploadSuccess === "function") {
                    onUploadSuccess()
                }
            })
            .catch(error => {
                setStatusMessage("Upload failed - " + error)
            })
    }
           
    

    return <div>
        <form className="flex-grow m-4 max-w-2xl" onSubmit={uploadFile} >
            <div className="form-control">
                <label className="label">
                    <span className="label-text">XML File Import</span>
                </label>
                <div className="flex gap-2">
                    <input
                        ref={uploadInputRef}
                        type="file"
                        disabled={disabled}
                        className="file-input file-input-bordered file-input-primary" />
                    <button disabled={disabled} className="btn btn-primary mr-2" >Upload</button>
                </div>
                <label className="label">
                    <span className="label-text-alt">{statusMessage}</span>
                </label>
            </div>
        </form>
    </div>
}