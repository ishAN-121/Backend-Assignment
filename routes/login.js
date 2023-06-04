const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database");
const crypto = require("crypto");
const path = require('path');
const router = express.Router();


router.get("/login", (req, res) => {
    res.render("login", { error: "" });
});

router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        `SELECT * FROM users WHERE username = ${db.escape(username)}`,
        async (err, result) => {
            if (err) {
                throw err;
            }

            if (!result[0]) {
                return res.render("login", {
                    error: "Username not found.Please Register",
                });
            }
            let hash = await bcrypt.hash(password, result[0].salt);

            if (hash !== result[0].hash) {
                return res.render("login", { error: "Password is wrong" });
            }
            const sessionId = crypto.randomUUID();
            const admin = result[0].admin;

            db.query(
                `INSERT INTO cookies (sessionId , userId , username) Values (${db.escape(
                    sessionId
                )}, ${db.escape(result[0].id)}, ${db.escape(username)})`,
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.cookie("sessionId", sessionId, {
                        maxAge: 6900000,
                        httpOnly: true,
                    });
                    if (admin) {
                        res.redirect("/admin");
                    } else res.redirect("/user");
                }
            );
        }
    );
});

module.exports = router;