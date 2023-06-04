const express = require("express");
const db = require("../database");
const router = express.Router();
const {validate} = require('../middleware');


router.get("/home", validate, (req, res) => {
    const admin = req.admin;
    if (!admin) res.redirect("user");
    else res.redirect("admin");
});

module.exports = router;