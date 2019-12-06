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
    console.log("Connected.")
    console.log("----------------------\n");
});

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

    customerInquirer(rows);
});


function customerInquirer(data) {
    //console.log(data);
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to purchase something?",
            name: "confirm",
            default: false
        }
    ]).then((inquirerResponse) => {
        if (inquirerResponse.confirm) {
            inquirer.prompt([
                {
                    type: "number",
                    message: "What is the ID of the item you'd like to purchase?",
                    name: "itemID"
                }, {
                    type: "number",
                    message: "How many would you like to purchase?",
                    name: "quantity"
                }
            ]).then((inquirerResponse2) => {
                //console.log(data);

                if (inquirerResponse2.quantity <= data[inquirerResponse2.itemID - 1].stock_quantity) {
                    con.query('update bamazon.products set stock_quantity = ? where item_id = ?',
                        [`${data[inquirerResponse2.itemID - 1].stock_quantity - inquirerResponse2.quantity}`, `${inquirerResponse2.itemID}`],
                        (err, result) => {
                            if (err) throw err;
                            //console.log(result.affectedRows)
                        })
                    console.log("Thanks for shopping!");
                    endConnection();
                } else {
                    console.log("There are not enough items in stock to purchase that many!");
                    inquirer.prompt([
                        {
                            type: "confirm",
                            message: "Would you like to continue shopping?",
                            name: "confirm",
                            default: false
                        }
                    ]).then((inquirerResponse3) => {
                        if (inquirerResponse3.confirm) {
                            inquirer.prompt([
                                {
                                    type: "number",
                                    message: "What is the ID of the item you'd like to purchase?",
                                    name: "itemID"
                                }, {
                                    type: "number",
                                    message: "How many would you like to purchase?",
                                    name: "quantity"
                                }
                            ]).then((inquirerResponse4) => {
                                if (inquirerResponse4.quantity <= data[inquirerResponse4.itemID - 1].stock_quantity) {
                                    con.query('update bamazon.products set stock_quantity = ? where item_id = ?',
                                        [`${data[inquirerResponse4.itemID - 1].stock_quantity - inquirerResponse4.quantity}`, `${inquirerResponse4.itemID}`],
                                        (err, result) => {
                                            if (err) throw err;
                                            //console.log(result.affectedRows)
                                        })
                                    console.log("Thanks for shopping!");
                                    endConnection();
                                } else {
                                    console.log("There still isn't enough for that! Have a good day.")
                                    endConnection();
                                }
                            })
                        } else {
                            console.log("Check back again later for updated stock!");
                            endConnection();
                        }
                    })
                }
            })
        } else {
            console.log("Maybe next time!\n");
            endConnection();
        }
    })
}

function endConnection() {
    con.end((err) => {
        if (err) throw err;
        console.log("Connection Terminated.")
    });
}

