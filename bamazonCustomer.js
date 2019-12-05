var mySQL = require('mysql');
var inquirer = require('inquirer');

var con = mySQL.createConnection({
    host: "localhost",
    user: "root",
    password: "root"
});

con.connect(function (error) {
    if (error) throw error;
    console.log("Connected!")
});

