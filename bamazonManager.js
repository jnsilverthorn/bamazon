var mySQL = require('mysql');
var inquirer = require('inquirer');

var con = mySQL.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bamazon"
});

con.connect((err) => {
    if (err) throw err;
    // console.log("Connected.")
    // console.log("----------------------\n");
});

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
            con.query('select * from bamazon.products', (err, rows) => {
                if (err) throw err;
                rows.forEach((row) => {
                    var inStock;

                    if (row.stock_quantity > 0) {
                        inStock = row.stock_quantity;
                    } else if (row.stock_quantity === 0 || row.stock_quantity < 0) {
                        inStock = "Out of Stock";
                    }

                    console.log(`Product ID: ${row.item_id} | Product: ${row.product_name} | Price: $${row.price}.00 | In Stock: ${inStock}`);
                    console.log("----------------------------------------------------------------------------------");
                });
            });

            initPrompt();
        } else if (inquirerResponse1.initialPrompt === "View Low Inventory") {
            con.query('select * from bamazon.products where stock_quantity <= 5', (err, rows) => {
                if (err) throw err;

                rows.forEach((row) => {
                    var inStock;

                    if (row.stock_quantity > 0) {
                        inStock = row.stock_quantity;
                    } else if (row.stock_quantity === 0 || row.stock_quantity < 0) {
                        inStock = "Out of Stock";
                    }

                    console.log(`Product ID: ${row.item_id} | Product: ${row.product_name} | Price: $${row.price}.00 | In Stock: ${inStock}`);
                    console.log("----------------------------------------------------------------------------------");
                });
            });
            initPrompt();
        } else if (inquirerResponse1.initialPrompt === "Add to Inventory") {

        } else if (inquirerResponse1.initialPrompt === "Add New Product") {

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

