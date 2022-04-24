const mysql = require('mysql2');
const mysqlConfig = require('./config.js');
var Promise = require('bluebird');

const connection = mysql.createConnection(mysqlConfig);

connection.connect(error => {
  if (error) {
    return console.log('Error in connecting to database');
  } else {
    console.log('Connected to mySQL reviews_service Database')
  }
});

const connectionTwo = connection;

const db = Promise.promisifyAll(connection);

module.exports.db = {db, connectionTwo};

