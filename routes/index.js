const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database");
const router = express.Router();
const path = require('path')



router.get("/", (req, res) => {
    res.render("index", { error: "" });
});

module.exports = router;