const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./../Schema/Admin");
const auth = require("./../middleware/auth");

router.get("/post", auth, async(req, res) => {
    res.status(200).send({ message: req.dataUser });
});

module.exports = router;