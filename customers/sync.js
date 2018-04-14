'use strict';

const request = require('request-promise');
const csvtojson = require('csvtojson');
const promise = require('bluebird');
const camelcase = require('camelcase');
const renameKeys = require('rename-keys');

const logger = require('../logger');
const notificationEmail = require('../notification/email');
const db = require('../db');

let numOfTries = 0;
let maxTries = process.env.CUSTOMERS_SYNC_MAX_TRIES;

const parseData = data => new promise((resolve, reject) => {
  let result = [];
  csvtojson({ delimiter: ';' })
    .fromString(data)
    .transf(json => result.push(renameKeys(json, camelcase)))
    .on('done', err => {
      if (err) reject(err);

      resolve(result);
    });
});

module.exports.run = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  logger.debug(`Starting customers sync ...`);
  logger.debug(`Number of tries: ${numOfTries}`);

  if (numOfTries > maxTries) {
    return notificationEmail.send('test', 'test', process.env.NOTIFICATION_EMAIL_FROM, process.env.NOTIFICATION_EMAIL_TO)
      .catch(err => logger.error(err))
      .finally(() => {
        numOfTries = 0;
        context.done();
        return;
      });
  }

  request(process.env.CUSTOMERS_SYNC_PARTNER_URL)
    .then(parseData)
    .then(customers => {
      if (!customers || customers.length === 0)
        throw new Error('No customers found');

      return promise.each(customers, customer => {
        return db.customer.findOrCreate({ where: { idUtente: customer.idUtente }, defaults: customer })
          .spread((customerFound, created) => {
            return !created
              ? db.customer.update(customer, { where: { idUtente: customer.idUtente } })
              : customerFound;
          })
      }).then(() => {
        numOfTries = 0;
        context.succeed();
      })
    })
    .catch(err => {
      numOfTries++;
      logger.error(err);
      context.fail(err);
    });

};