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

    //console.log('Data received from Db:\n');
    //console.log(rows);

    rows.forEach((row) => {
        console.log(`Product: ${row.product_name}`);
        console.log(`Product ID: ${row.item_id}\n`)
        console.log(`Price: $${row.price}.00`);
        console.log(`In Stock: ${row.stock_quantity}\n`);
        console.log("----------------------\n");
    });
});




function endConnection() {
    con.end((err) => {
        if (err) throw err;
        console.log("Connection Terminated.")
    });
}

endConnection();