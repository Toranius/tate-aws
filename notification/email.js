'use strict';

const promise = require('bluebird');
const mailgun = require('mailgun-js');

exports.send = (subject, text, from, to) => {
  const mailer = new mailgun({
    apiKey: process.env.MAIL_API_KEY,
    domain: process.env.MAIL_DOMAIN
  });

  return promise.promisify(mailer.messages().send({ from, to, subject, text }));
};