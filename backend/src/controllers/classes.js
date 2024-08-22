import express from "express";
import validator from "validator";
import * as Classes from "../models/classes.js";
import * as ClassActivityLocationTrainers from "../models/classes-activities-locations-trainers.js";
import * as Activities from "../models/activities.js";
import * as Users from "../models/users.js";
import * as Locations from "../models/locations.js";
import { formatDateTime } from "../utils.js";
import { convertToJSDate, convertToMySQLTime, convertToMySQLDate } from "../database.js";
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

            let editClassPromise = Promise.resolve(ClassActivityLocationTrainers.newClassActivityLocationTrainer(0, "", 0, "", 0, "", "", "", 0, "", ""));

            if (editID) {
                editClassPromise = ClassActivityLocationTrainers.getById(editID);
            }

            let fetchAllDataPromise;

            if (accessRole === 'trainer') {
                fetchAllDataPromise = Promise.all([
                    ClassActivityLocationTrainers.getAllByTrainerId(userID),
                    Locations.getAll(),
                    Activities.getAll(),
                    Users.getAll()
                ]);
            } else {
                if (!startDate && !endDate && !trainerFilter) {
                    fetchAllDataPromise = Promise.all([
                        ClassActivityLocationTrainers.getAll(),
                        Locations.getAll(),
                        Activities.getAll(),
                        Users.getAll()
                    ]);
                } else if (startDate && !endDate && !trainerFilter) {
                    fetchAllDataPromise = Promise.all([
                        ClassActivityLocationTrainers.getAllByStartDate(startDate),
                        Locations.getAll(),
                        Activities.getAll(),
                        Users.getAll()
                    ]);
                } else if (!startDate && endDate && !trainerFilter) {
                    fetchAllDataPromise = Promise.all([
                        ClassActivityLocationTrainers.getAllByEndDate(endDate),
                        Locations.getAll(),
                        Activities.getAll(),
                        Users.getAll()
                    ]);
                } else if (!startDate && !endDate && trainerFilter) {
                    fetchAllDataPromise = Promise.all([
                        ClassActivityLocationTrainers.getAllByTrainerId(trainerFilter),
                        Locations.getAll(),
                        Activities.getAll(),
                        Users.getAll()
                    ]);
                } else if (!startDate && endDate && trainerFilter) {
                    fetchAllDataPromise = Promise.all([
                        ClassActivityLocationTrainers.getAllByEndDateTrainerId(endDate, trainerFilter),
                        Locations.getAll(),
                        Activities.getAll(),
                        Users.getAll()
                    ]);
                } else if (startDate && !endDate && trainerFilter) {
                    fetchAllDataPromise = Promise.all([
                        ClassActivityLocationTrainers.getAllByStartDateTrainerId(startDate, trainerFilter),
                        Locations.getAll(),
                        Activities.getAll(),
                        Users.getAll()
                    ]);
                } else if (startDate && endDate && trainerFilter) {
                    fetchAllDataPromise = Promise.all([
                        ClassActivityLocationTrainers.getAllByTrainerIDDateRange(trainerFilter, startDate, endDate),
                        Locations.getAll(),
                        Activities.getAll(),
                        Users.getAll()
                    ]);
                } else {
                    fetchAllDataPromise = Promise.all([
                        ClassActivityLocationTrainers.getAllByDateRange(startDate, endDate),
                        Locations.getAll(),
                        Activities.getAll(),
                        Users.getAll()
                    ]);
                }
            }

            const [editClass, [allClasses, allLocations, allActivities, allUsers]] = await Promise.all([editClassPromise, fetchAllDataPromise]);

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
                formattedTime
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: error.message
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
                        message: "Invalid action specified."
                    });
            }
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: error.message
            });
        }
    }
);

classController.get("/classes", async (req, res) => {
    try {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = new Date();
        const mondayOfThisWeek = new Date(today);
        mondayOfThisWeek.setDate(today.getDate() - (today.getDay() - 1));
        const sundayOfThisWeek = new Date(mondayOfThisWeek);
        sundayOfThisWeek.setDate(sundayOfThisWeek.getDate() + 6);

        const dateOfMonday = convertToJSDate(mondayOfThisWeek);
        const dateOfSunday = convertToJSDate(sundayOfThisWeek);

        const classesThisWeek = await ClassActivityLocationTrainers.getAllByDateRange(convertToMySQLDate(mondayOfThisWeek), convertToMySQLDate(sundayOfThisWeek));

        const classesByDay = {
            "Monday": [],
            "Tuesday": [],
            "Wednesday": [],
            "Thursday": [],
            "Friday": [],
            "Saturday": [],
            "Sunday": [],
        };

        for (const classActivityLocationTrainer of classesThisWeek) {
            const classDayName = daysOfWeek[classActivityLocationTrainer.class_datetime.getDay()];
            classesByDay[classDayName].push(classActivityLocationTrainer);
        }

        res.status(200).json({
            classesByDay,
            mondayOfThisWeek,
            dateOfMonday,
            dateOfSunday
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
});

export default classController;
