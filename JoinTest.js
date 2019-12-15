var mySQL = require('mysql');
var inquirer = require('inquirer');

var con = mySQL.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

con.connect((err) => {
    if (err) throw err;
});

con.query(
    `SELECT sum(A.product_sales), B.department_name, B.department_id, B.over_head_costs 
    FROM bamazon.products AS A 
    INNER JOIN bamazon.departments AS B 
    ON A.department_name = B.department_name
    GROUP BY B.department_name`,
    (err, result) => {
        if (err) throw err;
        console.log(result);
    }
);

con.end((err) => {
    if (err) throw err;
    console.log("Connection Terminated.")
});