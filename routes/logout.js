const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database");
const path = require('path');
const router = express.Router();
const {validate} = require('../middleware');

router.get("/logout", validate, (req, res) => {
    req.headers.cookie = null;
    db.query(
        `DELETE FROM cookies WHERE userId = ${db.escape(req.userId)};`,
        (err, result) => {
            if (err) {
                throw err;
            } else {
                res.redirect("/login");
            }
        }
    );
});

module.exports = router;