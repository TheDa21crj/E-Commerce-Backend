const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./../Schema/Admin");

// Private| Admin Login| /api/admin/login || Admin ONLY
router.post(
  "/",
  [
    check("username", "username is Required").not().isEmpty(),
    check("password", "Password is Required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
      let userE = await User.findOne({ username });
      if (!userE) {
        return res
          .status(404)
          .json({ errors: [{ message: "Invalid Credentials" }] });
      }
      const matchP = await bcrypt.compare(password, userE.password);
      if (!matchP) {
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid Credentials" }] });
      }

      let token = await userE.generateToken();
      res.cookie("jwtTokenAuth", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });
      res.status(202).send({ message: `Token = ${token}` });
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
