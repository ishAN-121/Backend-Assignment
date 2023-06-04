const express = require("express");
const bodyparser = require("body-parser");
const db = require("../database");
const path = require('path')
const router = express.Router();
const {validate} = require('../middleware');


router.get("/user", validate, (req, res) => {
    const data = req.username;
    res.render("user", { error: "", data: data });
});

router.get("/checkout_books", validate, (req, res) => {
    const userId = req.userId;
    db.query(
        `SELECT * FROM requests Where userId = ${db.escape(
            userId
        )} AND status = 'owned'`,
        

        (err, result) => {
            const bookIds = result.map((row) => row.bookId);

                        if (err) throw err;
            else {
                db.query(
                    `SELECT * FROM books WHERE id IN (${bookIds.join(',')})`,
                    (err, result) => {
                        if (err) throw err;
                        else res.render("checkout_books", { books: result });
                    }
                );
            }
        }
    );
});

router.get("/checkout", validate, (req, res) => {
    res.render("checkout", { error: "" });
});

router.get("/checkin", validate, (req, res) => {
    res.render("checkin", { error: "" });
});

router.post("/checkout", validate, (req, res) => {
    const bookId = req.body.bookId;
    const userId = req.userId;
    const author = req.body.author;
    const title = req.body.title;

    db.query(
        `SELECT * FROM books WHERE id=${db.escape(bookId)} AND author=${db.escape(
            author
        )} AND title=${db.escape(title)}`,
        (err, result) => {
            if (err) {
                throw err;
            }
            if (result.length === 0) {
                return res.render("checkout", {
                    error: "Wrong Book Id",
                });
            }
            if (result[0].count === 0) {
                return res.render("checkout", {
                    error: "Currently Unavailable",
                });
            }
            db.query(
                `SELECT * FROM requests WHERE bookId = ${db.escape(
                    bookId
                )} AND userId = ${db.escape(
                    userId
                )} AND status = 'requested' || 'owned'`,
                (err, result) => {
                    if (err) throw err;
                    if (result.length > 0)
                        return res.render("checkout", {
                            error: "Already requested or owned",
                        });
                    db.query(
                        `INSERT INTO requests (bookId , userId , status) VALUES (${db.escape(
                            bookId
                        )},${db.escape(userId)}, 'requested')`,
                        (err, result) => {
                            if (err) throw err;
                            else {
                                db.query(
                                    `UPDATE books SET count = count - 1 WHERE id = ${db.escape(
                                        bookId
                                    )}`,
                                    (err, result) => {
                                        if (err) throw err;
                                    }
                                );
                                return res.redirect("/user");
                            }
                        }
                    );
                }
            );
        }
    );
});

router.post("/checkin", validate, (req, res) => {
    const bookId = req.body.bookId;
    const userId = req.userId;
    db.query(
        `SELECT * FROM requests WHERE bookId=${bookId} AND userId=${userId} AND status='owned'`,
        (err, result) => {
            if (err) throw err;
            if (result.length == 0) {
                return res.render("checkin", { error: "User does not have the book" });
            }

            db.query(
                `UPDATE requests SET status = 'checkin' WHERE  bookId=${db.escape(
                    bookId
                )} AND userId=${db.escape(userId)} AND status='owned'`,
                (err, result) => {
                    if (err) throw err;
                    return res.redirect("user");
                }
            );
        }
    );
});

module.exports = router;