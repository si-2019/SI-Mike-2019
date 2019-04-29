const mysql = require('mysql');

const connection = mysql.createConnection({
    host     :  process.env.DB_HOST_IP,
    database :  process.env.DB_NAME,
    user     :  process.env.DB_USER,
    password :  process.env.DB_PASSWORD,
});

const konekcijaNaBazu = () => {
    connection.connect((err)  => {
        if (err) { console.error('Error connecting: ' + err.stack); return; }
        console.log('Connected to the peca remote db: ' + connection.threadId);
    });
}

module.exports.connection = connection;
module.exports.konektuj = konekcijaNaBazu;