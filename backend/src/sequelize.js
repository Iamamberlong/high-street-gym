import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('high-street-gym-db', 'root', '1qaz2wsx', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

export default sequelize;
