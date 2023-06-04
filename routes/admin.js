const express = require("express");
const bodyparser = require("body-parser");
const db = require("../database");
const path = require('path');
const router = express.Router();
const {validate} = require('../middleware');


router.get("/admin", validate, (req, res) => {
    const data = req.username;
    res.render("admin", { error: "", data: data });
});

router.get("/update_add", validate, (req, res) => {
    res.render("update_add", { error: "" });
});

router.get("/update-delete", validate, (req, res) => {
    res.render("update-delete", { error: "" });
});

router.get("/admin-checkout", validate, (req, res) => {
    db.query(
        `SELECT * FROM requests WHERE status = 'requested'`,
        (err, result) => {
            if (err) throw err;
            else res.render("admin-checkout", { request: result });
        }
    );
});

router.get("/admin-checkin", validate, (req, res) => {
    db.query(`SELECT * FROM requests WHERE status = 'checkin'`, (err, result) => {
        if (err) throw err;
        else res.render("admin-checkin", { request: result });
    });
});


router.post("/approve-checkout", validate, (req, res) => {
    const requestids = req.body.requestids;

    const admin = req.admin;
    if (!admin) res.status(403).send("Access denied");
    else {
        db.query(
            `UPDATE requests SET status = 'owned' WHERE id IN (${db.escape(
                requestids
            )})`,
            (err, result) => {
                if (err) throw err;
                res.redirect("/admin-checkout");
            }
        );
    }
});

router.post("/deny-checkout", validate, (req, res) => {
    const requestids = req.body.requestids;
    //const escapedIds = requestids.map((id) => db.escape(id)).join(",");
    const admin = req.admin;
    if (!admin) res.status(403).send("Access denied");
    else {
        db.query(
            `UPDATE requests SET status = NULL WHERE id IN (${db.escape(
                requestids
            )})`,
            (err, result) => {
                if (err) throw err;
                db.query(
                    `UPDATE books SET count = count + 1 WHERE id IN (SELECT bookId FROM requests WHERE id IN (${db.escape(
                        requestids
                    )}))`,
                    (err, result) => {
                        if (err) throw err;
                        res.redirect("admin-checkout");
                    }
                );
            }
        );
    }
});

router.post("/approve-checkin", validate, (req, res) => {
    const requestids = req.body.requestids;
    //const escapedIds = requestids.map((id) => db.escape(id)).join(",");
    const admin = req.admin;
    if (!admin) res.status(403).send("Access denied");
    else {
        db.query(
            `UPDATE requests SET status = 'returned' WHERE id IN (${db.escape(
                requestids
            )})`,
            (err, result) => {
                if (err) throw err;
                db.query(
                    `UPDATE books SET count = count + 1 WHERE id IN (SELECT bookId FROM requests WHERE id IN (${db.escape(
                        requestids
                    )}))`,
                    (err, result) => {
                        if (err) throw err;
                        res.redirect("admin-checkin");
                    }
                );
            }
        );
    }
});

router.post("/deny-checkin", validate, (req, res) => {
    const requestids = req.body.requestids;
    // const escapedIds = requestids.map((id) => db.escape(id)).join(",");
    const admin = req.admin;
    if (!admin) res.status(403).send("Access denied");
    else {
        db.query(
            `UPDATE requests SET status = 'owned' WHERE id IN (${db.escape(
                requestids
            )})`,
            (err, result) => {
                if (err) throw err;
                else {
                    res.redirect("admin-checkin");
                }
            }
        );
    }
});

router.post("/update_add", validate, (req, res) => {
    const admin = req.admin;
    const title = req.body.title;
    const author = req.body.author;
    const increase = req.body.copies;
    if (!admin) res.status(403).send("Access denied");
    else {
        db.query(
            `SELECT * FROM books WHERE title = ${db.escape(
                title
            )} AND author = ${db.escape(author)}`,
            (err, result) => {
                if (err) throw err;
                if (result.length != 0) {
                    db.query(
                        `UPDATE books SET count = count + ?, totalcount = totalcount + ? WHERE author = ${db.escape(
                            author
                        )} AND title = ${db.escape(title)}`,
                        [increase, increase],
                        (err) => {
                            if (err) throw err;
                            res.redirect("admin");
                        }
                    );
                } else {
                    db.query(
                        `INSERT INTO books (author , title , count , totalcount) VALUES (${db.escape(
                            author
                        )},${db.escape(title)},${db.escape(increase)},${db.escape(
                            increase
                        )})`,
                        (err, result) => {
                            if (err) throw err;
                            res.redirect("admin");
                        }
                    );
                }
            }
        );
    }
});

router.post("/update-delete", validate, (req, res) => {
    const admin = req.admin;
    const title = req.body.title;
    const author = req.body.author;
    const decrease = req.body.copies;

    if (!admin) res.status(403).send("Access denied");
    else {
        db.query(
            `SELECT * FROM books WHERE title = ${db.escape(
                title
            )} AND author = ${db.escape(author)}`,
            (err, result) => {
                if (err) throw err;
                if (result.length == 0) {
                    return `res.render('update-delete',{error :"Book Does not exist"});`;
                }
                if (result[0].count == 0) {
                    return res.render("update-delete", {
                        error: "Book Does not available for deletion",
                    });
                }
                if (decrease > result[0].count) {
                    return res.render("update-delete", {
                        error: "Too many copies for deletion",
                    });
                } else {
                    db.query(
                        `UPDATE books SET count = count - ?, totalcount = totalcount - ? WHERE author = ${db.escape(
                            author
                        )} AND title = ${db.escape(title)}`,
                        [decrease, decrease],
                        (err, result) => {
                            if (err) throw err;
                            res.redirect("admin");
                        }
                    );
                }
            }
        );
    }
});

module.exports = router;
