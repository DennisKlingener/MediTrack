const admin = require("firebase-admin");
const serviceAccount =  require("./medi-track-e545d-firebase-adminsdk-fbsvc-9095070f4b.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;