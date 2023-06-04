const express = require("express");
require("dotenv").config();
const bodyparser = require("body-parser");
const db = require("./database");
const path = require('path');
db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connection established");
    }
});

const app = express();
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
const PORT = process.env.SERVERPORT || 3000;

const login = require("./routes/login");
const register = require("./routes/register");
const index = require("./routes/index");
const user = require("./routes/user");
const admin = require("./routes/admin");
const logout = require("./routes/logout");
const books = require("./routes/books");
const home = require("./routes/home");

app.use(login);
app.use(register);
app.use(index);
app.use(user);
app.use(admin);
app.use(logout);
app.use(books);
app.use(home);

app.listen(PORT, (error) => {
    if (!error)
        console.log(
            "Server is Successfully Running,and App is listening on port: " + PORT
        );
    else console.log("Error occurred, server can't start", error);
});


