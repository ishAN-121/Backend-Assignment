const express = require("express");
const db = require("../database");
const router = express.Router();
const validate = require('../middleware');

router.get("/books", (req, res) => {
    db.query("SELECT * FROM books", (err, result) => {
        if (err) {
            throw err;
        } else {
            res.render("books", { books: result });
        }
    });
});

module.exports = router;