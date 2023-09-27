const mongoose = require('mongoose');
const { MONGODB_URL } = require('../config/index.js');

const bd_connection = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URL)
        console.log(`Database connection established ${conn.connection.host}`);
    } catch (error) {
        console.log('Error connecting' + error)
    }
}

module.exports = bd_connection;