let express = require("express");
let mysql = require("mysql");
let body_parser = require("body-parser");
let cors = require('cors');

let app = express();

// serving static content
app.use(express.static('../../client/public'));

// add a parser
app.use(body_parser.json());
app.use(express.json());

// get a mysql connection
app.use((req, res, next) => {
    res.locals.connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ajax',
    });
    res.locals.connection.connect();
    next();
});
app.use(cors());
// Serving a simple rest api
// get an item
app.get('/api/:id', (req, res, next) => {
    res.locals.connection.query("SELECT * FROM `users` WHERE `id` = "
        + mysql.escape(req.params.id) + ";", (error, results) => {
            if (error) {
                res.status(500);
                res.json({
                    status: 500,
                    error: 'Ein Fehler ist augetreten bei der Verbindung zur Datenbank: ' + error,
                    response: null,
                });
            }
            else if (!results[0]) {
                res.json({
                    status: 400,
                    error: 'Die angefragte Id ist nicht vorhanden!',
                    response: null,
                });
            }
            else {
                res.json({
                    status: 200,
                    error: null,
                    response: results[0],
                });
            }
        });
});

// get a list
app.get('/api', (req, res, next) => {
    res.locals.connection.query("SELECT * FROM `users`;", (error, results) => {
        if (error) {
            res.status(500);
            res.json({
                status: 500,
                error: error,
                response: null,
            });
        }
        else {
            res.json({
                status: 200,
                error: null,
                response: results,
            });
        }
    });
});

// update a user
app.post('/api/:id', (req, res, next) => {
    let newUser = req.body;
    // for educational reasons only send an extra query to the database
    res.locals.connection.query("SELECT * FROM `users` WHERE `id` = "
        + mysql.escape(req.params.id) + ";", (error, results) => {
            if (error) {
                res.status(500);
                res.json({
                    status: 500,
                    error: 'Ein Fehler ist augetreten bei der Verbindung zur Datenbank: ' + error,
                    response: null,
                });
            }
            else if (!results[0]) {
                res.json({
                    status: 400,
                    error: 'Die angefragte Id ist nicht vorhanden!',
                    response: null,
                });
            }
            else {
                let oldUser = results[0];
                let changedAttributes = Object.getOwnPropertyNames(newUser);
                changedAttributes.forEach((elem) => {
                    oldUser[elem] = newUser[elem];
                });
                let query = `UPDATE \`users\` SET \`username\` = 
                    	${mysql.escape(oldUser.username)}, \`given_name\` = 
                        ${mysql.escape(oldUser.given_name)},
                        \`surname\` = ${mysql.escape(oldUser.surname)},
                        \`password\` = ${mysql.escape(oldUser.password)} 
                        WHERE \`id\` = ${mysql.escape(oldUser.id)}`;
                res.locals.connection.query(query, (error) => {
                    if (error) {
                        res.status(500);
                        res.json({
                            status: 500,
                            error: error,
                            response: null,
                        });
                    }
                    else {
                        res.json({
                            status: 200,
                            error: null,
                            response: newUser,
                        });
                    }
                });
            }
        });
});

// add a user
app.post('/api', (req, res, next) => {
    console.log(req.body);
    let user = req.body;
    // construct a query
    let query = `INSERT INTO \`users\` (\`username\`, \`given_name\`,
            \`surname\`, \`password\`) VALUES
            (${mysql.escape(user.username)}, ${mysql.escape(user.given_name)},
            ${mysql.escape(user.surname)}, ${mysql.escape(user.password)});`;
    res.locals.connection.query(query, (error) => {
        if (error) {
            res.status(500);
            res.json({
                status: 500,
                error: error,
                response: null,
            });
        }
        else {
            res.locals.connection.query('SELECT LAST_INSERT_ID();', (error, results) => {
                if (error) {
                    res.status(500);
                    res.json({
                        status: 500,
                        error: error,
                        response: null,
                    });
                }
                else {
                    let id = results[0]['LAST_INSERT_ID()'];
                    user.id = id;
                    res.json({
                        status: 200,
                        error: null,
                        response: user,
                    });
                }
            });
        }
    });
});

app.delete('/api/:id', (req, res, next) => {
    res.locals.connection.query('DELETE FROM `users` WHERE `id` = '
            + mysql.escape(req.params.id) + ';', (error) => {
        if (error) {
            res.status(500);
                    res.json({
                        status: 500,
                        error: error,
                        response: null,
                    });
        }
        else {
            res.json({
                status: 200,
                error: null,
                response: 'Der Benutzer wurde erfolgreich gelöscht.',
            });
        }
    });
})

const port = 8000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
