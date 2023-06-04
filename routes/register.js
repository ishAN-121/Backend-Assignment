const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database");
const crypto = require("crypto");
const path = require('path');
const router = express.Router();

async function hashing(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return [hash, salt];
}

router.get("/register", (req, res) => {
    res.render("register", { error: "", msg: "" });
});

router.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    var [hash, salt] = await hashing(password);
    if (!username || !password || !confirmpassword)
        return res.render("register", {
            error: "Please enter all details",
            msg: "",
        });
    else if (password !== confirmpassword) {
        return res.render("register", { error: "Passwords do not match", msg: "" });
    } else {
        db.query(
            `SELECT * FROM users WHERE username = ${db.escape(username)}`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                if (result.length != 0) {
                    return res.render("register.ejs", {
                        error: "Username Already Exists",
                        msg: "",
                    });
                } else {
                    db.query(
                        `INSERT INTO users (username, salt, hash, admin) VALUES (${db.escape(
                            username
                        )}, ${db.escape(salt)}, ${db.escape(hash)} , 0)`,
                        (err, result) => {
                            if (err) {
                                throw err;
                            } else {
                                res.render("register", {
                                    error: "",
                                    msg: "Registered successfully",
                                });
                            }
                        }
                    );
                }
            }
        );
    }
});


module.exports = router;