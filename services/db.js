const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: '',
    database: 'agri-2-go'
});

conn.connect();

module.exports = conn;