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
    con.query('SELECT * FROM bamazon.products', (err, rows) => {
        if (err) throw err;
        rows.forEach((row) => {
            var inStock;

            if (row.stock_quantity > 0) {
                inStock = row.stock_quantity;
            } else if (row.stock_quantity === 0 || row.stock_quantity < 0) {
                inStock = "Out of Stock";
            }

            console.log(`ID: ${row.item_id} | Department: ${row.department_name} | Product: ${row.product_name} | Price: $${row.price}.00 | In Stock: ${inStock}`);
            console.log("--------------------------------------------------------------------------------------------------------");
        });
        initPrompt();
    });
}

function initPrompt() {
    inquirer.prompt([
        {
            type: "list",
            message: "Welcome. What would you like to do?",
            choices: ["View Products For Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "End Connection"],
            name: "initialPrompt",
        }
    ]).then((inquirerResponse1) => {
        if (inquirerResponse1.initialPrompt === "View Products For Sale") {
            displayTable();
        } else if (inquirerResponse1.initialPrompt === "View Low Inventory") {
            con.query('SELECT * FROM bamazon.products WHERE stock_quantity <= 5', (err, rows) => {
                if (err) throw err;

                rows.forEach((row) => {
                    var inStock;

                    if (row.stock_quantity > 0) {
                        inStock = row.stock_quantity;
                    } else if (row.stock_quantity === 0 || row.stock_quantity < 0) {
                        inStock = "Out of Stock";
                    }

                    console.log(`ID: ${row.item_id} | Department: ${row.department_name} | Product: ${row.product_name} | Price: $${row.price}.00 | In Stock: ${inStock}`);
                    console.log("--------------------------------------------------------------------------------------------------------");
                });
                initPrompt();
            });

        } else if (inquirerResponse1.initialPrompt === "Add to Inventory") {
            con.query('SELECT * FROM bamazon.products', (err, rows) => {
                if (err) throw err;
                rows.forEach((row) => {
                    var inStock;

                    if (row.stock_quantity > 0) {
                        inStock = row.stock_quantity;
                    } else if (row.stock_quantity === 0 || row.stock_quantity < 0) {
                        inStock = "Out of Stock";
                    }

                    console.log(`ID: ${row.item_id} | Department: ${row.department_name} | Product: ${row.product_name} | Price: $${row.price}.00 | In Stock: ${inStock}`);
                    console.log("---------------------------------------------------------------------------------------------------------");
                });
                inquirer.prompt([
                    {
                        type: "number",
                        message: "What is the ID of the item that you'd like to add inventory for?",
                        name: "item_id"
                    }, {
                        type: "number",
                        message: "How many would you like to add to the inventory?",
                        name: "quantity_add"
                    }
                ]).then((inquirerResponse2) => {
                    con.query('UPDATE bamazon.products SET stock_quantity = ? WHERE item_id = ?',
                        [`${rows[inquirerResponse2.item_id - 1].stock_quantity + inquirerResponse2.quantity_add}`, `${inquirerResponse2.item_id}`],
                        (err, result) => {
                            if (err) throw err;
                        })
                    displayTable();
                })
            });
        } else if (inquirerResponse1.initialPrompt === "Add New Product") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the name of the product you are adding?",
                    name: "product_name"
                }, {
                    type: "input",
                    message: "What department does this product belong in?",
                    name: "department"
                }, {
                    type: "number",
                    message: "What is the price of the new product?",
                    name: "item_price"
                }, {
                    type: "number",
                    message: "What is the quantity in stock of the item you are adding?",
                    name: "item_quantity"
                }
            ]).then((inquirerResponse3) => {
                con.query(`INSERT INTO bamazon.products (product_name, department_name, price, stock_quantity) VALUES ("${inquirerResponse3.product_name}", "${inquirerResponse3.department}", "${inquirerResponse3.item_price}", "${inquirerResponse3.item_quantity}")`, (err, result) => {
                    if (err) throw err;
                    console.log("Product added.")
                })
                displayTable();
            })
        } else if (inquirerResponse1.initialPrompt === "End Connection") {
            endConnection();
        }
    })
};

initPrompt();

function endConnection() {
    con.end((err) => {
        if (err) throw err;
        console.log("Connection Terminated.")
    });
}

