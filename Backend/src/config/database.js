const mongoose = require('mongoose');

function connectToDb() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.error("Database connection error:", err.message);
        process.exit(1);
    })
}

module.exports = connectToDb;