'use strict';

const HTTPStatus = require('http-status');
const _ = require('lodash');

const db = require('../db');
const { customerAttributes } = require('./model');

exports.list = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const params = event.queryStringParameters ? _.cloneDeep(event.queryStringParameters) : null;

  const filter = {
    where: {},
    limit: null,
    offset: null
  };

  if (params) {
    filter.where = _(params).pick(Object.keys(customerAttributes()))
      .omitBy(_.isNull).omitBy(_.isUndefined).value();

    filter.limit = params.limit;
    filter.offset = params.offset;
  }

  db.customer.findAndCountAll(filter)
    .then(customersPage => callback(null, { statusCode: HTTPStatus.OK, body: JSON.stringify(customersPage) }))
    .catch(err => callback(err));
};

exports.get = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const id = event.pathParameters.id;

  db.customer.find({ where: { idUtente: id } })
    .then(customer => {
      if (!customer)
        return callback(null, { statusCode: HTTPStatus.NOT_FOUND });

      return callback(null, { statusCode: HTTPStatus.OK, body: JSON.stringify(customer) })
    })
    .catch(err => callback(err));
};

exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const customer = JSON.parse(event.body);

  db.customer.create(customer)
    .then(customer => callback(null, { statusCode: HTTPStatus.CREATED, body: JSON.stringify(customer) }))
    .catch(err => callback(err));
};

exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const id = event.pathParameters.id;
  const customer = JSON.parse(event.body);

  db.customer.find({ where: { idUtente: id } })
    .then(customerFound => {
      if (!customerFound)
        return callback(null, { statusCode: HTTPStatus.NOT_FOUND });

      return db.customer.update(customer, { where: { idUtente: id } })
        .then(() => callback(null, { statusCode: HTTPStatus.NO_CONTENT }));
    })
    .catch(err => callback(err));
};

exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const id = event.pathParameters.id;

  db.customer.find({ where: { idUtente: id } })
    .then(customerFound => {
      if (!customerFound)
        return callback(null, { statusCode: HTTPStatus.NOT_FOUND });

      return db.customer.destroy({ where: { idUtente: id } })
        .then(() => callback(null, { statusCode: HTTPStatus.NO_CONTENT }));
    })
    .catch(err => callback(err));
};