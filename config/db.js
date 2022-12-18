const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURL");

const connectDB = async() => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
        });
        console.log("DataBase Connected");
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectDB;