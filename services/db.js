const Sequelize = require("sequelize");

const connectionString = process.env.DATABASE_URL || "postgres://postgres:Taolatao0@localhost:5432/QLTODO";

const db = new Sequelize(connectionString);

module.exports = {
    db
};