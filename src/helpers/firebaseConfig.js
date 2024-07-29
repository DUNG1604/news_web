var admin = require("firebase-admin");
require('dotenv').config();
var serviceAccount = require(process.env.CONFIG_FIREBASE);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ce-web-8212b-default-rtdb.firebaseio.com",
  storageBucket: "gs://ce-web-8212b.appspot.com"
});

const bucket = admin.storage().bucket();

module.exports = bucket;

