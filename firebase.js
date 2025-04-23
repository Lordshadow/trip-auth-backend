require('dotenv').config();
const fs = require('node:fs');
const admin = require("firebase-admin");
const serviceAccount = JSON.parse(
  fs.readFileSync("/etc/secrets/firebaseServiceKey.json")
)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
