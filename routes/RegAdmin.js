const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("./../Schema/Admin");

// Private| Admin Register| /api/RegAdmin || Admin ONLY
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
      let user = await User.findOne({ username });

      if (user) {
        return res.status(400).json({ message: `User Already Exists` });
      }
      console.log(req.body);

      user = new User({
        username,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      res.status(202).json({ message: `User Registered` });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
);

module.exports = router;
