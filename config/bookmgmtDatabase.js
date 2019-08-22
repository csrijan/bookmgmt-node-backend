'use strict';

const mysql = require('mysql');

const conn = mysql.createConnection({
	host : 'localhost',
	user : 'app_user',
	password : 'admin456',
	database : 'bookmgmt'
});

conn.connect(function(err) {
	if(err) throw err;
});

module.exports = conn;