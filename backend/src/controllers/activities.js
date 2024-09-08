import { Router } from "express";
import * as Activities from "../models/activities.js"; // Adjust the import based on your actual path
import auth from "../middleware/auth.js";
import xml2js from "xml2js";
import { param, body, validationResult } from "express-validator";

// in the reference project, trails.js it contains the following http requests:
// #1 trailController.get("/", async (req, res) => {
// #2 trailController.get("/:id", (req, res) => {
// #3 trailController.post("/upload-xml", auth(["admin", "spotter"]), (req, res) => {
// #4 trailController.post("/", auth(["admin", "moderator"]), (req, res) => {
// #5 trailController.patch("/:id", auth(["admin", "moderator"]), (req, res) => {
// #6 trailController.delete("/:id", auth(["admin", "moderator"]), (req, res) => {

const activityController = Router();

// #1 Get all activities
activityController.get("/activities", async (req, res) => {
  try {
    const activities = await Activities.getAll();
    console.log("activities are: ", activities)
    res.status(200).json({
      status: 200,
      message: "Get all activities",
      activities: activities,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to get activities",
    });
  }
});

// #2 Get an activity by ID
activityController.get(
  "activities/:id",
  param("id").isInt().withMessage("Activity ID must be an integer"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Validation error",
        errors: errors.array(),
      });
    }

    const activityID = req.params.id;

    try {
      const activity = await Activities.getByID(activityID);
      if (activity) {
        res.status(200).json({
          status: 200,
          message: "Get activity by ID",
          activity: activity,
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "Activity not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to get activity by ID",
      });
    }
  }
);

// #3 using async await to modify the above snippet.
// activityController.post("activities/upload-xml", auth(["admin"]), async (req, res) => {
//   if (req.files && req.files["xml-file"]) {

//       // Access the XML file as a string
//       const XMLFile = req.files["xml-file"];
//       console.log("xmlFile is:", XMLFile)
//       const file_text = XMLFile.data.toString();


//       // Set up XML parser
//       const parser = new xml2js.Parser();
//       parser.parseStringPromise(file_text)
//       .then(data => {

//         console.log("Parsed XML data: ", JSON.stringify(data, null, 2));

//         const activityUpload = data["activity-upload"]
//         const activityUploadAttributes = activityUpload["$"];
//         const operation = activityUploadAttributes["operation"];
//         const activitiesData = activityUpload["activities"][0]["activity"];

//         console.log("activities data looks like: ", activitiesData)
//         if (operation == "insert") {
//           Promise.all(activitiesData.map((activityData) => {

//             const activityModel = Activities.newActivity(null, activityData.name.toString(), activityData.description.toString(), activityData.duration.toString())
//             return Activities.create(activityModel)
//           })).then(results => {
//             res.status(200).json({
//               status: 200,
//               message: "XML Upload insert successfully."
//             })
//           }).catch(error => {
//             res.status(500).json({
//               status: 500,
//               message: "XML upload failed on database operation - " + error
//             })
//           })
//         } else if (operation == "update") {
//           Promise.all(activitiesData.map((activityData) => {
//             const activityModel = Activities.newActivity(
//               activityData.id.toString(),
//               activityData.name.toString(),
//               activityData.description.toString(),
//               activityData.duration.toString()
//             )
//             return Activities.update(activityModel)
//           })).then(results => {
//             res.status(200).json({
//               status: 200,
//               message: "XML Upload update successful."
//             })
//           }).catch(error => {
//             res.status(500).json({
//               status: 500,
//               message: "XML upload failed on database operation - " + error
//             })
//           })
//         } else {
//           res.status(400).json({
//             status: 400,
//             message: "XML Contains invalid operation attribute value"
//           })
//         }

//       })
//         .catch(error => {
//           res.status(500).json({
//             status: 500,
//             message: "Error parsing XML - " + error
//           })
//         })
//       } else {
//         res.status(400).json({
//           status: 400,
//           message: "No file selected."
//         })
//       }
// });

activityController.post("/activities/upload-xml", auth(["admin"]), (req, res) => {
  if (req.files && req.files["xml-file"]) {
      // Access the XML file as a string
      const XMLFile = req.files["xml-file"];
      const file_text = XMLFile.data.toString();

      // Set up XML parser
      const parser = new xml2js.Parser();
      parser.parseStringPromise(file_text)
          .then(data => {
              const activityUpload = data["activity-upload"];
              const activityUploadAttributes = activityUpload["$"];
              const operation = activityUploadAttributes["operation"];
              const activitiesData = activityUpload["activities"][0]["activity"];

              console.log("activitiesData looks like: ", activitiesData);

              if (operation === "insert") {
                  Promise.all(activitiesData.map((activityData) => {
                      // Convert the xml object into a model object
                      const activityModel = Activities.newActivity(
                          null, // ID will be auto-generated for new records
                          activityData.name[0].toString(),
                          activityData.description[0].toString(),
                          activityData.duration[0].toString()
                      );
                      // Return the promise of each creation query
                      return Activities.create(activityModel);
                  }))
                  .then(results => {
                      res.status(200).json({
                          status: 200,
                          message: "XML Upload insert successful",
                      });
                  })
                  .catch(error => {
                      res.status(500).json({
                          status: 500,
                          message: "XML upload failed on database operation - " + error.message,
                      });
                  });
              } else if (operation === "update") {
                  Promise.all(activitiesData.map((activityData) => {
                      // Convert the xml object into a model object
                      const activityModel = Activities.newActivity(
                          activityData.id[0].toString(),
                          activityData.name[0].toString(),
                          activityData.description[0].toString(),
                          activityData.duration[0].toString()
                      );
                      // Return the promise of each update query
                      return Activities.update(activityModel);
                  }))
                  .then(results => {
                      res.status(200).json({
                          status: 200,
                          message: "XML Upload update successful",
                      });
                  })
                  .catch(error => {
                      res.status(500).json({
                          status: 500,
                          message: "XML upload failed on database operation - " + error.message,
                      });
                  });
              } else {
                  res.status(400).json({
                      status: 400,
                      message: "XML Contains invalid operation attribute value",
                  });
              }
          })
          .catch(error => {
              res.status(500).json({
                  status: 500,
                  message: "Error parsing XML - " + error.message,
              });
          });
  } else {
      res.status(400).json({
          status: 400,
          message: "No file selected",
      });
  }
});


// #4 Create a new activity
activityController.post(
  "activities/",
  auth(["admin"]),
  [
    body("name")
      .isString()
      .withMessage("Activity name must be a string")
      .notEmpty()
      .withMessage("Activity name is required"),
    body("description")
      .isString()
      .withMessage("Activity description must be a string")
      .optional(), // Make description optional
    body("duration")
      .isInt({ min: 0 })
      .withMessage("Activity duration must be a positive integer")
      .optional(), // Make duration optional
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Validation error",
        errors: errors.array(),
      });
    }

    const activityData = req.body;

    // TODO: Implement request validation

    try {
      const activity = {
        activity_name: activityData.name,
        activity_description: activityData.description,
        activity_duration: activityData.duration,
      };

      const newActivity = await Activities.create(activity);
      res.status(200).json({
        status: 200,
        message: "Created activity",
        activity: newActivity,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to create activity",
      });
    }
  }
);

// #5 Update an activity by ID
activityController.patch(
  "activities/:id",
  auth(["admin"]),
  [
    param("id")
      .isInt({ gt: 0 })
      .withMessage("Activity ID must be a positive integer"),
    body("name")
      .isString()
      .withMessage("Activity name must be a string")
      .optional(), // Make name optional
    body("description")
      .isString()
      .withMessage("Activity description must be a string")
      .optional(), // Make description optional
    body("duration")
      .isInt({ min: 0 })
      .withMessage("Activity duration must be a non-negative integer")
      .optional(), // Make duration optional
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Validation error",
        errors: errors.array(),
      });
    }
    const activityID = req.params.id;
    const activityData = req.body;

    // TODO: Implement request validation

    try {
      const updatedActivity = await Activities.update(activityID, activityData);
      res.status(200).json({
        status: 200,
        message: "Updated activity",
        activity: updatedActivity,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to update activity",
      });
    }
  }
);

// #6 Delete an activity by ID
activityController.delete(
  "activities/:id",
  auth(["admin"]),
  [
    param("id")
      .isInt({ gt: 0 })
      .withMessage("Activity ID must be a positive integer"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Validation error",
        errors: errors.array(),
      });
    }

    const activityID = req.params.id;

    try {
      await Activities.remove(activityID);
      res.status(200).json({
        status: 200,
        message: "Deleted activity",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to delete activity",
      });
    }
  }
);

export default activityController;

// #3 upload xml file

// activityController.post("/upload-xml", auth(["admin"]), (req, res) => {
//     if (req.files && req.files["xml-file"]) {
//         // Access the XML file as a string
//         const XMLFile = req.files["xml-file"]
//         const file_text = XMLFile.data.toString()

//         // Set up XML parser
//         const parser = new xml2js.Parser();
//         parser.parseStringPromise(file_text)
//             .then(data => {
//                 const activityUpload = data["activity-upload"]
//                 const activityUploadAttributes = activityUpload["$"]
//                 const operation = activityUploadAttributes["operation"]
//                 // Slightly painful indexing to reach nested children
//                 const activitiesData = activityUpload["activities"][0]["activity"]

//                 if (operation == "insert") {
//                     Promise.all(activitiesData.map((activityData) => {
//                         // Convert the xml object into a model object
//                         const activityModel = activities.newActivity(null, activityData.name.toString())
//                         // Return the promise of each creation query
//                         return Activities.create(activityModel)
//                     })).then(results => {
//                         res.status(200).json({
//                             status: 200,
//                             message: "XML Upload insert successful",
//                         })
//                     }).catch(error => {
//                         res.status(500).json({
//                             status: 500,
//                             message: "XML upload failed on database operation - " + error,
//                         })
//                     })
//                 } else if (operation == "update") {
//                     Promise.all(activitiesData.map((activityData) => {
//                         // Convert the xml object into a model object
//                         const activityModel = newActivity(
//                             activityData.id.toString(),
//                             activityData.name.toString()
//                         )
//                         // Return the promise of each creation query
//                         return Activities.update(activityModel)
//                     })).then(results => {
//                         res.status(200).json({
//                             status: 200,
//                             message: "XML Upload update successful",
//                         })
//                     }).catch(error => {
//                         res.status(500).json({
//                             status: 500,
//                             message: "XML upload failed on database operation - " + error,
//                         })
//                     })

//                 } else {
//                     res.status(400).json({
//                         status: 400,
//                         message: "XML Contains invalid operation attribute value",
//                     })
//                 }
//             })
//             .catch(error => {
//                 res.status(500).json({
//                     status: 500,
//                     message: "Error parsing XML - " + error,
//                 })
//             })

//     } else {
//         res.status(400).json({
//             status: 400,
//             message: "No file selected",
//         })
//     }
// })
