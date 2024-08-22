import { Sequelize } from 'sequelize';
import Activity from './models/activities-sequelize.js';
import BlogPost from './models/blog_posts.js';
import Booking from './models/bookings.js';
import Class from './models/classes.js';
import Location from './models/locations.js';
import User from './models/users.js';

// Initialize Sequelize instance
const sequelize = new Sequelize('high-street-gym-db', 'root', '1qaz2wsx', {
    host: 'localhost',
    dialect: 'mysql'
});

// Define and sync models
async function syncModels() {
    try {
        // Authenticate and sync models
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync models
        await sequelize.sync({ alter: true }); // Use `force: true` to drop tables before recreating
        console.log('All models were synchronized successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

syncModels();

export { sequelize };
