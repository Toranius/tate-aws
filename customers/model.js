'use strict';

const Sequelize = require('sequelize');

const attributes = {
  idUtente: {
    primaryKey: true,
    type: Sequelize.STRING,
    allowNull: false
  },
  codiceCliente: Sequelize.STRING,
  email: Sequelize.STRING,
  nome: Sequelize.STRING,
  cognome: Sequelize.STRING,
  dataNascita: Sequelize.STRING,
  codiceFiscale: Sequelize.STRING,
  stato: Sequelize.STRING,
  attivo: Sequelize.STRING,
  nuovo: Sequelize.STRING,
  rete: Sequelize.STRING,
  agente: Sequelize.STRING,
  canoneRai: Sequelize.STRING
};

exports.customerAttributes = () => attributes;

exports.customer = sequelize => {
  return sequelize.define('customer', attributes);
};