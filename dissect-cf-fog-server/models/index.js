const config = require('../config/db.config');
const Sequelize = require("sequelize");

const sequelizeConfig = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: 0,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelizeConfig;

db.user = require("../models/user.model.js")(sequelizeConfig, Sequelize);

/**
 * Returns the database with Sequelize.
 */
module.exports = db;