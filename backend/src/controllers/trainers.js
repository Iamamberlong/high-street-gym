import { Router } from "express" 
import bcrypt from "bcryptjs" 
import express from "express" 
import * as Trainers from "../models/trainer-users.js" 
import validator from "validator" 
import jwt from "jsonwebtoken" 
import dotenv from "dotenv" 
import auth from "../middleware/auth.js" 
import verifyToken from "../middleware/verifyToken.js"
import { blacklist } from '../middleware/checkTokenBlacklisted.js' 

const trainerController = express.Router()

trainerController.get("/trainers", async (req, res) => {
    try {
        const trainers = await Trainers.getAll(); // Fetch trainers from the database
        console.log("all the trainers are: ", trainers);
        res.status(200).json({
            status: 200,
            message: "Get all trainers",
            trainers: trainers
        });
    } catch (error) {
        console.error("Error fetching trainers:", error);
        res.status(500).json({ 
            status: 500,
            message: "Failed to fetch trainers",
            error: error.message
        });
    }
});


export default trainerController