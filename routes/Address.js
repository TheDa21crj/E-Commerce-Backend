const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const Address = require("./../Schema/Address");
const UserAuth = require("./../middleware/UserAuth");
const UserSchema = require("./../Schema/User");

// Private || Add Address || api/Address/add
router.post(
  "/add",
  [
    UserAuth,
    check("name", "name is Required").not().isEmpty(),
    check("address", "address is Required").not().isEmpty(),
    check("pinCode", "pinCode is Required").not().isEmpty(),
    check("town", "town is Required").not().isEmpty(),
    check("state", "state is Required").not().isEmpty(),
    check("country", "country is Required").not().isEmpty(),
    check("phoneNumber", "phoneNumber is Required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let userID = req.userId;
    const { name, address, pinCode, town, state, country, phoneNumber } =
      req.body;

    try {
      let userCheck = await Address.findOne({ user: userID });
      if (userCheck) {
        let addressed = {};
        addressed.name = name;
        addressed.address = address;
        addressed.pinCode = pinCode;
        addressed.town = town;
        addressed.state = state;
        addressed.country = country;
        addressed.phoneNumber = phoneNumber;

        for (let i = 0; i < userCheck.address.length; i++) {
          if (userCheck.address[i].pinCode == pinCode) {
            return res.status(400).json({ message: "same" });
          }
        }

        let add = await Address.findOneAndUpdate(
          { user: userID },
          {
            $push: {
              address: addressed,
            },
          }
        );

        console.log(name, address, pinCode, town, state, country, phoneNumber);

        return res.status(200).json("Address Added");
      } else {
        let addressLocal = {};
        addressLocal.user = userID;
        addressLocal.address = {};
        addressLocal.address.name = name;
        addressLocal.address.address = address;
        addressLocal.address.pinCode = pinCode;
        addressLocal.address.town = town;
        addressLocal.address.state = state;
        addressLocal.address.country = country;
        addressLocal.address.phoneNumber = phoneNumber;
        let newaddress = new Address(addressLocal);
        await newaddress.save();
        return res.status(200).json("Address Added");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
);

// Private || View Address || api/Address
router.get(
  "/",
  [UserAuth, check("_id", "_id is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let userID = req.userId;

    try {
      let userCheck = await Address.findOne({ user: userID });
      if (userCheck) {
        return res.status(200).json({ message: userCheck.address });
      } else {
        return res.status(304).json({ message: "zero" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
);

// Private || Delete Address || api/Address/delete
router.delete("/delete", [UserAuth], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { _id } = req.body;

  let userID = req.userId;

  try {
    let userCheck = await Address.updateOne(
      { user: userID },
      { $pull: { address: { _id: _id } } }
    );

    res.status(500).json(userCheck);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

module.exports = router;
