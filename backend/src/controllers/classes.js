import express from "express";
import validator from "validator";
import moment from "moment-timezone";
import { query, body, param, validationResult } from "express-validator";
import * as Classes from "../models/classes.js";
import * as ClassActivityLocationTrainers from "../models/classes-activities-locations-trainers.js";
import * as Activities from "../models/activities.js";
import * as Users from "../models/users.js";
import * as Locations from "../models/locations.js";
import { formatDateTime } from "../utils.js";
import {
  convertToJSDate,
  convertToMySQLTime,
  convertToMySQLDate,
} from "../database.js";
import auth from "../middleware/auth.js";

const classController = express.Router();

classController.get(
  "/manage-classes",
  auth(["admin", "trainer"]),
  async (req, res) => {
    try {
      const editID = req.query.edit_id;
      const { accessRole, firstName } = req.user;
      const userID = req.user.userID;
      const startDate = req.query.start_date;
      const endDate = req.query.end_date;
      const trainerFilter = req.query.trainer_filter;

      let editClassPromise = Promise.resolve(
        ClassActivityLocationTrainers.newClassActivityLocationTrainer(
          0,
          "",
          0,
          "",
          0,
          "",
          "",
          "",
          0,
          "",
          ""
        )
      );

      if (editID) {
        editClassPromise = ClassActivityLocationTrainers.getById(editID);
      }

      let fetchAllDataPromise;

      if (accessRole === "trainer") {
        fetchAllDataPromise = Promise.all([
          ClassActivityLocationTrainers.getAllByTrainerId(userID),
          Locations.getAll(),
          Activities.getAll(),
          Users.getAll(),
        ]);
      } else {
        if (!startDate && !endDate && !trainerFilter) {
          fetchAllDataPromise = Promise.all([
            ClassActivityLocationTrainers.getAll(),
            Locations.getAll(),
            Activities.getAll(),
            Users.getAll(),
          ]);
        } else if (startDate && !endDate && !trainerFilter) {
          fetchAllDataPromise = Promise.all([
            ClassActivityLocationTrainers.getAllByStartDate(startDate),
            Locations.getAll(),
            Activities.getAll(),
            Users.getAll(),
          ]);
        } else if (!startDate && endDate && !trainerFilter) {
          fetchAllDataPromise = Promise.all([
            ClassActivityLocationTrainers.getAllByEndDate(endDate),
            Locations.getAll(),
            Activities.getAll(),
            Users.getAll(),
          ]);
        } else if (!startDate && !endDate && trainerFilter) {
          fetchAllDataPromise = Promise.all([
            ClassActivityLocationTrainers.getAllByTrainerId(trainerFilter),
            Locations.getAll(),
            Activities.getAll(),
            Users.getAll(),
          ]);
        } else if (!startDate && endDate && trainerFilter) {
          fetchAllDataPromise = Promise.all([
            ClassActivityLocationTrainers.getAllByEndDateTrainerId(
              endDate,
              trainerFilter
            ),
            Locations.getAll(),
            Activities.getAll(),
            Users.getAll(),
          ]);
        } else if (startDate && !endDate && trainerFilter) {
          fetchAllDataPromise = Promise.all([
            ClassActivityLocationTrainers.getAllByStartDateTrainerId(
              startDate,
              trainerFilter
            ),
            Locations.getAll(),
            Activities.getAll(),
            Users.getAll(),
          ]);
        } else if (startDate && endDate && trainerFilter) {
          fetchAllDataPromise = Promise.all([
            ClassActivityLocationTrainers.getAllByTrainerIDDateRange(
              trainerFilter,
              startDate,
              endDate
            ),
            Locations.getAll(),
            Activities.getAll(),
            Users.getAll(),
          ]);
        } else {
          fetchAllDataPromise = Promise.all([
            ClassActivityLocationTrainers.getAllByDateRange(startDate, endDate),
            Locations.getAll(),
            Activities.getAll(),
            Users.getAll(),
          ]);
        }
      }

      const [editClass, [allClasses, allLocations, allActivities, allUsers]] =
        await Promise.all([editClassPromise, fetchAllDataPromise]);

      const formattedDate = convertToJSDate(editClass.class_datetime);
      const formattedTime = convertToMySQLTime(editClass.class_datetime).trim();

      res.status(200).json({
        allClasses,
        allLocations,
        allActivities,
        allUsers,
        startDate,
        endDate,
        trainerFilter,
        userID,
        editClass,
        accessRole,
        firstName,
        formattedDate,
        formattedTime,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  }
);

classController.post(
  "/manage_classes",
  auth(["admin", "trainer"]),
  async (req, res) => {
    try {
      const formData = req.body;
      const activityId = parseInt(formData.activity);
      const trainerId = parseInt(formData.trainer);
      const locationId = parseInt(formData.location);
      const classDate = formData.class_date;
      const classTime = formData.class_time;
      const classDateTime = `${classDate} ${classTime}`;

      const editedClass = Classes.newClass(
        parseInt(formData.class_id),
        classDateTime,
        locationId,
        activityId,
        trainerId,
        0
      );

      switch (formData.action) {
        case "create":
          await Classes.create(editedClass);
          res.status(201).json({ message: "Class created successfully" });
          break;
        case "update":
          await Classes.update(editedClass);
          res.status(200).json({ message: "Class updated successfully" });
          break;
        case "delete":
          await Classes.deleteById(editedClass.id);
          res.status(200).json({ message: "Class deleted successfully" });
          break;
        default:
          res.status(400).json({
            status: "Invalid action",
            message: "Invalid action specified.",
          });
      }
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  }
);
// The following code is working: it does not check if the trainer already has a class at that time and date.
// classController.post(
//   "/classes",
//   auth(["admin", "trainer"]),
//   async (req, res) => {
//     try {
//       const { activity_id, location_id, dateTime, user_id } = req.body;
//       console.log(
//         "activity_id, location_id, dateTime, user_id",
//         activity_id,
//         location_id,
//         dateTime,
//         user_id
//       );

//       if (!activity_id || !location_id || !dateTime || !user_id) {
//         return res.status(400).json({
//           status: 400,
//           message: "Missing required field(s).",
//         });
//       }

//       const isValidDateTime = (dateTime) => {
//         const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
//         return regex.test(dateTime);
//       };
//       console.log("isvalid: ", isValidDateTime);
//       const classData = {
//         class_datetime: dateTime,
//         location_id: parseInt(location_id),
//         activity_id: parseInt(activity_id),
//         trainer_user_id: parseInt(user_id),
//       };
//       console.log("classes to be created is: ", classData);
//       const createdClass = await Classes.create(classData);
//       res.status(201).json({
//         status: 201,
//         message: "Class created successfully.",
//         data: createdClass,
//       });
//     } catch (error) {
//       console.error("Error creating class: ", error);
//       res.status(500).json({
//         status: 500,
//         message: "Error creating class",
//         error: error.message,
//       });
//     }
//   }
// );

classController.post(
  "/classes",
  auth(["admin", "trainer"]),
  async (req, res) => {
    try {
      const { activity_id, location_id, dateTime, user_id } = req.body;
      console.log(
        "activity_id, location_id, dateTime, user_id",
        activity_id,
        location_id,
        dateTime,
        user_id
      );

      if (!activity_id || !location_id || !dateTime || !user_id) {
        return res.status(400).json({
          status: 400,
          message: "Missing required field(s).",
        });
      }

      const isValidDateTime = (dateTime) => {
        const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        return regex.test(dateTime);
      };
      console.log("isvalid: ", isValidDateTime);

      try {
        const existing = await Classes.getByTrainerLocationDatetimeActivity(
          user_id,
          location_id,
          dateTime,
          activity_id,
        );
        console.log("existing: ", existing);
        if (existing) {
          res.status(400).json({
            status: 400,
            message: "The trainer already has class at the date and time.",
          });
        }
      } catch (error) {
        if (error === "Trainer has no class at this date and time.") {
          const classData = {
            class_datetime: dateTime,
            location_id: parseInt(location_id),
            activity_id: parseInt(activity_id),
            trainer_user_id: parseInt(user_id),
          };
          console.log("classes to be created is: ", classData);

          try {
            const createdClass = await Classes.create(classData);
            res.status(201).json({
              status: 201,
              message: "Class created successfully.",
              data: createdClass,
            });
          } catch (createError) {
            console.error("Error creating class: ", createError);
            return res.status(500).json({
              status: 500,
              message: "Error creating class.",
              error: createError.message,
            });
          }
        } else {
          console.error("Unexpected error: ", error);
          return res.status(500).json({
            status: 500,
            message: "Error checking duplicated class.",
            error: error.message,
          });
        }
      }
    } catch (error) {
      console.error("Error processing request: ", error);
      res.status(500).json({
        status: 500,
        message: "Error processing request. ",
        error: error.message,
      });
    }
  }
);

//// ****** the following code is working ******
classController.get("/classes", async (req, res) => {
  try {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date();
    const mondayOfThisWeek = new Date(today);
    mondayOfThisWeek.setDate(today.getDate() - (today.getDay() - 1));
    console.log("Monday of this week:", mondayOfThisWeek);
    const sundayOfThisWeek = new Date(mondayOfThisWeek);
    sundayOfThisWeek.setDate(sundayOfThisWeek.getDate() + 6);

    const dateOfMonday = convertToJSDate(mondayOfThisWeek);
    console.log("dateofMonday: ", dateOfMonday);
    const dateOfSunday = convertToJSDate(sundayOfThisWeek);
    console.log("dateofSunday", dateOfSunday);
    const classesThisWeek =
      await ClassActivityLocationTrainers.getAllByDateRange(
        convertToMySQLDate(mondayOfThisWeek),
        convertToMySQLDate(sundayOfThisWeek)
      );

    const classesByDay = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    for (const classActivityLocationTrainer of classesThisWeek) {
      const classDayName =
        daysOfWeek[classActivityLocationTrainer.class_datetime.getDay()];

      const formattedDate = convertToMySQLDate(
        classActivityLocationTrainer.class_datetime
      );
      console.log('formattedDate is:', formattedDate)
      classActivityLocationTrainer.class_datetime = formattedDate; // Update the date

      classesByDay[classDayName].push(classActivityLocationTrainer);
    }
    console.log("classesByDay", classesByDay);

    res.status(200).json({
      classesByDay,
      mondayOfThisWeek,
      dateOfMonday,
      dateOfSunday,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
});

classController.get("/classes/:gymClassName/:classDate", async (req, res) => {
  const { gymClassName, classDate } = req.params;
  console.log("gymClassName is: ", gymClassName);
  console.log("gymClass date: ", classDate);
  try {
    let classes = await ClassActivityLocationTrainers.getByClassNameAndDate(
      gymClassName,
      classDate
    );
    
    classes = classes.map(gymClass => {
      return {
        ...gymClass,
        class_datetime: convertToMySQLDate(gymClass.class_datetime) + convertToMySQLTime(gymClass.class_datetime)
      }
    })
    console.log("classes are: ", classes);
    res.status(200).json({classes}); // Return the class data as JSON
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(404).json({ message: error }); // Return a 404 response if no results are found
  }
});

classController.get(
  "/classes/my-classes",
  auth(["admin", "trainer"]),
  async (req, res) => {
    try {
      const { userID } = req.user;
      console.log("req.user: ", userID);

      const myGymClasses =
        await ClassActivityLocationTrainers.getAllByTrainerId(userID);
      console.log("myGymClasses: ", myGymClasses);
      res.status(200).json({
        status: 200,
        message: "Get my classes successfully.",
        data: myGymClasses,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  }
);

classController.get("/classes/:startDate/:endDate", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log("req.query for startDate and endDate is: ", req.query);

    const start = convertToJSDate(startDate);
    const end = convertToJSDate(endDate);

    const gymClasses = await ClassActivityLocationTrainers.getAllByDateRange(
      convertToMySQLDate(mondayOfThisWeek),
      convertToMySQLDate(sundayOfThisWeek)
    );

    res.status(200).json({
      gymClasses,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
});

// classController.get("/classes/:startDate/:endDate", async (req, res) => {

//   try {
//     const { startDate, endDate } = req.query
//     console.log("req.query for startDate and endDate is: ", req.query)
//     const daysOfWeek = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];
//     const start = new Date(startDate);
//     const mondayOfThisWeek = new Date(start);
//     mondayOfThisWeek.setDate(start.getDate() - (start.getDay() - 1));
//     const sundayOfThisWeek = new Date(mondayOfThisWeek);
//     sundayOfThisWeek.setDate(sundayOfThisWeek.getDate() + 6);

//     const dateOfMonday = convertToJSDate(mondayOfThisWeek);
//     const dateOfSunday = convertToJSDate(sundayOfThisWeek);

//     const classesThisWeek =
//       await ClassActivityLocationTrainers.getAllByDateRange(
//         convertToMySQLDate(mondayOfThisWeek),
//         convertToMySQLDate(sundayOfThisWeek)
//       );

//     const classesByDay = {
//       Monday: [],
//       Tuesday: [],
//       Wednesday: [],
//       Thursday: [],
//       Friday: [],
//       Saturday: [],
//       Sunday: [],
//     };

//     for (const classActivityLocationTrainer of classesThisWeek) {
//       const classDayName =
//         daysOfWeek[classActivityLocationTrainer.class_datetime.getDay()];
//       classesByDay[classDayName].push(classActivityLocationTrainer);
//     }

//     res.status(200).json({
//       classesByDay,
//       mondayOfThisWeek,
//       dateOfMonday,
//       dateOfSunday,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "Error",
//       message: error.message,
//     });
//   }
// });

classController.delete(
  "/classes/:id",
  auth(["admin", "trainer"]), // Adjust roles as needed
  [
    param("id")
      .isInt({ gt: 0 })
      .withMessage("Class ID must be a positive integer"),
  ],
  async (req, res) => {
    const { id } = req.params;

    // Validate request parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Invalid class ID",
        errors: errors.array(),
      });
    }

    try {
      // Call API function to archive the class
      await Classes.deleteById(id); // Implement this function in your API layer
      res.status(200).json({
        status: 200,
        message: "Class successfully archived",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to archive class",
        error: error.message,
      });
    }
  }
);

export default classController;
