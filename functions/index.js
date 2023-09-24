const functions = require('firebase-functions');
const searchAddresses = require('./searchAddresses');

exports.searchAddresses = functions.https.onRequest(searchAddresses);
