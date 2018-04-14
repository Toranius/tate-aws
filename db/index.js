'use strict';

const Sequelize = require('sequelize');

const logger = require('../logger');
const { customer } = require('../customers/model');

let sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  operatorsAliases: false,
});

module.exports = {
  customer: customer(sequelize),
  sequelize,
  Sequelize
};