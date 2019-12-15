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

function displayTable() {
    con.query('SELECT * FROM bamazon.departments', (err, rows) => {
        if (err) throw err;
        rows.forEach((row) => {
            console.log(`ID: ${row.department_id} | Department: ${row.department_name} | Overhead Costs: $${row.over_head_costs}.00`);
            console.log("---------------------------------------------------------------------");
        });
        initial_prompt();
    });
}

function initial_prompt() {
    inquirer.prompt([
        {
            type: "list",
            message: "Welcome supervisor. What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department", "End Connection"],
            name: "initial_prompt"
        }
    ]).then((inquirerResponse) => {
        if (inquirerResponse.initial_prompt === "View Product Sales by Department") {
            con.query(
                `SELECT sum(A.product_sales), B.department_name, B.department_id, B.over_head_costs 
                FROM bamazon.products AS A 
                INNER JOIN bamazon.departments AS B 
                ON A.department_name = B.department_name
                GROUP BY B.department_name`,
                (err, rows) => {
                    if (err) throw err;
                    //console.log(rows);
//need to fix
                //     rows.forEach((row) => {
                //         console.log(row)
                //         var sum = (row.over_head_costs - row[0])

                //         console.log(`ID: ${row.department_id} | Department: ${row.department_name} | Overhead Costs: ${row.over_head_costs} | Sales: ${row.sum(A.product_sales)} | Profit: ${sum}`)
                //         console.log("---------------------------------------------------------------------------------");
                //     })
                // }
            );
        } else if (inquirerResponse.initial_prompt === "Create New Department") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the name of the new department?",
                    name: "departmentName"
                }, {
                    type: "number",
                    message: "What are the new department's overhead costs?",
                    name: "costs"
                }
            ]).then((inquirerResponse2) => {
                con.query(`INSERT INTO bamazon.departments (department_name, over_head_costs) VALUES ("${inquirerResponse2.departmentName}", "${inquirerResponse2.costs}")`, (err, result) => {
                    if (err) throw err;
                })
                displayTable();
            })
        } else if (inquirerResponse.initial_prompt === "End Connection") {
            endConnection();
        }
    })
}

displayTable();

function endConnection() {
    con.end((err) => {
        if (err) throw err;
        console.log("Connection Terminated.")
    });
}