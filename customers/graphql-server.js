'use strict';

const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const bodyParser = require('body-parser');
const expressGraphQL = require('express-graphql');

const customerSchema = require('./graphql-schema');

const app = express();

app.use(bodyParser.json());

app.use('/', expressGraphQL(() => ({ schema: customerSchema })));

const server = awsServerlessExpress.createServer(app);

exports.run = (event, context) => awsServerlessExpress.proxy(server, event, context);