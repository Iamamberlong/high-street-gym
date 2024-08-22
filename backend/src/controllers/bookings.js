import express from "express";
import validator from "validator";
import auth from "../middleware/auth.js";
import * as BookingClassUsers from "../models/bookings-classes-users-location-activity.js";
import * as Bookings from "../models/bookings.js";
import * as Classes from "../models/classes.js";
import * as Locations from "../models/locations.js";
import * as Users from "../models/users.js";
import * as ClassActivityLocationTrainers from "../models/classes-activities-locations-trainers.js";
import * as Activities from "../models/activities.js";
import { formatDateTime } from "../utils.js";
import { convertToJSDate, convertToMySQLTime } from "../database.js";

const bookingController = express.Router();


bookingController.get(
    "/my-bookings",
    auth(["admin", "member", "trainer"]),
    async (req, res) => {
        const { userID, userRole, firstName } = req.user;

        try {
            const myBookings = await BookingClassUsers.getAllByMemberId(userID);
            res.status(200).json({ 
                status: 200,
                message: "Bookings retrieve successfully",
                myBookings,
                userRole, 
                firstName });
        } catch (error) {
            res.status(500).json({
                status: "No bookings",
                message: "You have no bookings yet.",
                error: error.message
            });
        }
    }
);

bookingController.post(
    "/bookings/booking-confirmation",
    auth(["admin", "member", "trainer"]),
    async (req, res) => {
        try {
            const userID = req.user.userID;

            console.log("The current logged user ID is: ", userID)
            const { class_id, user_id, created_datetime } = req.body

            if (!class_id || !user_id) {
                return res.status(400).json({
                    status: 400,
                    message: "Class ID and User ID are required"
                })
            }

            if (userID!== user_id) {
                return res.status(403).json({
                    status: 403,
                    message: "User ID mismatch"
                })
            }
            // Check if the user already booked this class
            const existingBooking = await Bookings.checkExistingBooking(userID, class_id)
            console.log("The existing booking is: ", existingBooking)
            console.log("Existing booking id: ", existingBooking.id)

            if (existingBooking) {
                return res.status(409).json({
                    status: 409,
                    message: "You have already booked this class"
                })
            }



            // const bookingCreatedDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const editedBooking = Bookings.newBooking(
                null,
                user_id,
                class_id,
                created_datetime,
                0
            )
            console.log("The booking that is going to be inserted is: ", editedBooking)

            await Bookings.create(editedBooking);
            res.status(201).json({ 
                status: 201,
                message: "Booking created successfully" });
        } catch (error) {
            res.status(500).json({
                status: "Failed",
                message: error.message
            });
        }
    }
);

bookingController.delete(
    '/bookings/my-bookings/:id', 
    auth(["admin", "member", "trainer"]),
    async (req, res) => {

        const { id } = req.params
        const {userID, role} = req.user
        try {

            const booking = await Bookings.getById(id)

            if (!booking) {
                return res.status(404).json({
                    status: 404,
                    message: "Booking not found."
                })
            }

            await Bookings.deleteById(id)
            res.status(200).json({
                status: 200,
                message: "Booking successfully deleted."
            })

        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Error deleting booking."
            })

        }
    }
)

bookingController.get(
    "/manage-bookings",
    auth(["admin"]),
    async (req, res) => {
        try {
            const editID = req.query.edit_id;
            const memberFilter = req.query.member_filter;
            const { accessRole, firstName } = req.user;

            let editBookingPromise = Promise.resolve(BookingClassUsers.newBookingClassUser(0, 0, 0, "", "", 0, "", 0, "", 0, "", "", "", ""));

            if (editID) {
                editBookingPromise = BookingClassUsers.getById(editID);
            }

            const fetchAllDataPromise = (memberFilter)
                ? Promise.all([
                    BookingClassUsers.getAllByMemberId(memberFilter),
                    Locations.getAll(),
                    ClassActivityLocationTrainers.getAll(),
                    Activities.getAll(),
                    Users.getAll()
                ])
                : Promise.all([
                    BookingClassUsers.getAll(),
                    Locations.getAll(),
                    ClassActivityLocationTrainers.getAll(),
                    Activities.getAll(),
                    Users.getAll()
                ]);

            const [editBooking, [allBookings, allLocations, allClasses, allActivities, allUsers]] = await Promise.all([editBookingPromise, fetchAllDataPromise]);

            const formattedDate = convertToJSDate(editBooking.class_datetime);
            const formattedTime = convertToMySQLTime(editBooking.class_datetime).trim();

            res.status(200).json({
                allBookings,
                allLocations,
                allClasses,
                allActivities,
                allUsers,
                editBooking,
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

bookingController.post("/my-bookings", async (req, res) => {
    try {
        const bookingIdToDelete = req.body.booking_id;
        await Bookings.deleteById(bookingIdToDelete);
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({
            status: "Fail",
            message: "Failed to delete the booking"
        });
    }
});

bookingController.post(
    "/manage-bookings",
    auth(["admin"]),
    async (req, res) => {
        try {
            const { accessRole, firstName } = req.user;
            const userID = req.user.userID;
            const formData = req.body;
            const bookingID = formData.booking_id;
            const activityId = parseInt(formData.activity);
            const trainerId = parseInt(formData.trainer);
            const locationId = parseInt(formData.location);
            const classId = parseInt(formData.class_id);
            const classDate = formData.class_date;
            const classTime = formData.class_time;
            const classDateTime = `${classDate} ${classTime}`;
            const memberID = formData.member;

            const bookingCreatedDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

            const newBooking = Bookings.newBooking(null, memberID, classId, bookingCreatedDateTime, 0);
            const editedBooking = Bookings.newBooking(bookingID, memberID, classId, bookingCreatedDateTime, 0);

            switch (formData.action) {
                case "create":
                    await Bookings.create(newBooking);
                    res.status(200).json({ message: "Booking created successfully" });
                    break;
                case "update":
                    await Bookings.update(editedBooking);
                    res.status(200).json({ message: "Booking updated successfully" });
                    break;
                case "delete":
                    await Bookings.deleteById(editedBooking.id);
                    res.status(200).json({ message: "Booking deleted successfully" });
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

export default bookingController;
