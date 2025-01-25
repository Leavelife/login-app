import { Sequelize } from "sequelize";

const db = new Sequelize('onlineshop', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});
export default db;