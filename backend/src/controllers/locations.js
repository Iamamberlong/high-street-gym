import express from "express"
import * as Locations from "../models/locations.js"
import { body, param, validationResult} from "express-validator"
import xml2js from "xml2js"
import auth from "../middleware/auth.js";

const locationController = express.Router();

// in the reference project, trails.js it contains the following http requests:
// #1 trailController.get("/", async (req, res) => {
// #2 trailController.get("/:id", (req, res) => {
// #3 trailController.post("/upload-xml", auth(["admin", "spotter"]), (req, res) => {
// #4 trailController.post("/", auth(["admin", "moderator"]), (req, res) => {
// #5 trailController.patch("/:id", auth(["admin", "moderator"]), (req, res) => {
// #6 trailController.delete("/:id", auth(["admin", "moderator"]), (req, res) => {

// Middleware to set local variables based on session

// #1 Route to get all locations
locationController.get("/locations", async (req, res) => {
    const locations = await Locations.getAll()

    console.log("locations are: ", locations)

    res.status(200).json({
        status: 200,
        message: "Get all locations",
        locations: locations,
    })
});

// #2 get by id

locationController.get(
    "/locations/:id", 
    param("id").isInt().withMessage("Location ID must be an integer"),
    (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const locationID = req.params.id

    // TODO: implement request validation

        Locations.getByID(locationID)
            .then(location => {
                res.status(200).json({
                    status: 200,
                    message: "Get location by ID",
                    location: location
                })
            })
            .catch(error => {
                res.status(500).json({
                status: 500,
                message: "Failed to get location by ID"
                })
            }) 
    }
)

// #3 Uploading xml file
locationController.post("/locations/upload-xml", auth(["admin"]), (req, res) => {
    if (req.files && req.files["xml-file"]) {
        // Access the XML file as a string
        const XMLFile = req.files["xml-file"]
        const file_text = XMLFile.data.toString()

        // Set up XML parser
        const parser = new xml2js.Parser();
        parser.parseStringPromise(file_text)
            .then(data => {
                const locationUpload = data["location-upload"]
                const locationUploadAttributes = locationUpload["$"]
                const operation = locationUploadAttributes["operation"]
                // Slightly painful indexing to reach nested children
                const locationsData = locationUpload["locations"][0]["location"]

                if (operation == "insert") {
                    Promise.all(locationsData.map((locationData) => {
                        // Convert the xml object into a model object
                        const locationModel = Locations.newLocation(null, locationData.name.toString())
                        // Return the promise of each creation query
                        return Locations.create(locationModel)
                    })).then(results => {
                        res.status(200).json({
                            status: 200,
                            message: "XML Upload insert successful",
                        })
                    }).catch(error => {
                        res.status(500).json({
                            status: 500,
                            message: "XML upload failed on database operation - " + error,
                        })
                    })
                } else if (operation == "update") {
                    Promise.all(locationsData.map((locationData) => {
                        // Convert the xml object into a model object
                        const locationModel = newLocation(
                            locationData.id.toString(),
                            locationData.name.toString()
                        )
                        // Return the promise of each creation query
                        return Locations.update(locationModel)
                    })).then(results => {
                        res.status(200).json({
                            status: 200,
                            message: "XML Upload update successful",
                        })
                    }).catch(error => {
                        res.status(500).json({
                            status: 500,
                            message: "XML upload failed on database operation - " + error,
                        })
                    })

                } else {
                    res.status(400).json({
                        status: 400,
                        message: "XML Contains invalid operation attribute value",
                    })
                }
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "Error parsing XML - " + error,
                })
            })


    } else {
        res.status(400).json({
            status: 400,
            message: "No file selected",
        })
    }
})

//#4 post a new location

locationController.post(
    "/locations", 
    auth(["admin"]),
    body("name").isString().notEmpty().withMessage("Location name is required"),
    (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        // get location data from the form
        const locationData = req.body
  

        // Convert the location data into an Location model object
        const location = Locations.newLocation(null, locationData.name)

    // use the create model function to insert this location into the database
        Locations.create(location).then(location => {
            res.status(200).json({
                status: 200,
                message: "Created Location",
                location: location,
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to create location",
            })
        })
    }
)

// #5 modify a specific location

locationController.patch(
    "/locations/:id", 
    auth(["admin"]),
    param("id").isInt().withMessage("Invalid location ID"),
    body("name").isString().notEmpty().withMessage("Location name is required"),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const locationID = req.params.id
        const locationData = req.body

    const location = Locations.newLocation(locationID, locationData.name)
    Locations.update(location).then(updatedLocation => {
        res.status(200).json({
            status: 200,
            message: "Update location by ID",
            location: updatedLocation
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to update location"
        })
    })   
})

// #6 delete a location by id
locationController.delete(
    "/locations/:id", 
    auth(["admin"]),
    param("id").isInt().withMessage("Invalid lcoation ID"), 
    (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const locationID = req.params.id
        Locations.deleteByID(locationID).then(() => {
            res.status(200).json({
                status: 200,
                message: "Deleted location by ID"
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to delete location"
            })
        })
    

   
})
export default locationController;
