// db.js
const mysql = require('mysql2');

// Set up the connection using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connect to the database and handle errors
db.connect(error => {
    if (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit if the connection fails
    }
    console.log('Connected to the MySQL database');
});

module.exports = db;
