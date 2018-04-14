'use strict';

const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql');
const _ = require('lodash');

const db = require('../db');
const { customerAttributes } = require('./model');

const CustomerType = new GraphQLObjectType({
  name: 'Customer',

  fields: () => ({
    idUtente: { type: GraphQLString },
    codiceCliente: { type: GraphQLString },
    email: { type: GraphQLString },
    nome: { type: GraphQLString },
    cognome: { type: GraphQLString },
    dataNascita: { type: GraphQLString },
    codiceFiscale: { type: GraphQLString },
    stato: { type: GraphQLString },
    attivo: { type: GraphQLString },
    nuovo: { type: GraphQLString },
    rete: { type: GraphQLString },
    agente: { type: GraphQLString },
    canoneRai: { type: GraphQLString }
  })
});

const CustomerPageType = new GraphQLObjectType({
  name: 'CustomerPage',

  fields: () => ({
    count: { type: GraphQLInt },
    rows: { type: new GraphQLList(CustomerType) }
  })
});

const QueryType = new GraphQLObjectType({
  name: 'CustomersQuery',
  description: 'Customers query',

  fields: () => ({
    customer: {
      type: CustomerType,
      args: {
        idUtente: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args, context, info) => db.customer.find({ where: { idUtente: args.idUtente } })
    },
    customers: {
      type: CustomerPageType,
      args: {
        idUtente: { type: GraphQLString },
        codiceCliente: { type: GraphQLString },
        email: { type: GraphQLString },
        nome: { type: GraphQLString },
        cognome: { type: GraphQLString },
        dataNascita: { type: GraphQLString },
        codiceFiscale: { type: GraphQLString },
        stato: { type: GraphQLString },
        attivo: { type: GraphQLString },
        nuovo: { type: GraphQLString },
        rete: { type: GraphQLString },
        agente: { type: GraphQLString },
        canoneRai: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt }
      },
      resolve: (parent, args, context, info) => {
        const filter = { where: {}, limit: null, offset: null };

        if (args) {
          filter.where = _(args).pick(Object.keys(customerAttributes()))
            .omitBy(_.isNull).omitBy(_.isUndefined).value();

          filter.limit = args.limit;
          filter.offset = args.offset;
        }

        return db.customer.findAndCountAll(filter);
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: QueryType
});