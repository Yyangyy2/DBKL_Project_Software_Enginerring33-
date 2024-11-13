// // server.js
// const express = require('express');
// const cors = require('cors');
// const mysql = require('mysql2');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MySQL connection
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "dbkl_project",
// });

// db.connect(error => {
//     if (error) {
//         console.error('Error connecting to the database:', error);
//         return;
//     }
//     console.log('Connected to the MySQL database');
// });



// const PORT = 8081;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
