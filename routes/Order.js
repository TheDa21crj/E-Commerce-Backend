const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const UserAuth = require("./../middleware/UserAuth");
const Order = require("./../Schema/Order");

// Private || See Order || api/Order
router.get("/", UserAuth, async (req, res) => {
  let userID = req.userId;

  try {
    let userCheck = await Order.findOne({ user: userID });
    if (userCheck) {
      return res.status(200).json(userCheck.List);
    } else {
      return res.status(304).json(0);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

// Private || Add Order || api/Order/add
router.post(
  "/add",
  [
    UserAuth,
    check("id", "id is Required").not().isEmpty(),
    check("price", "price is Required").not().isEmpty(),
    check("qunatity", "qunatity is Required").not().isEmpty(),
    check("size", "size is Required").not().isEmpty(),
    check("imageSrc", "imageSrc is Required").not().isEmpty(),
    check("name", "name is Required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let userID = req.userId;

    const { id, price, qunatity, size, imageSrc, name } = req.body;
    if (userID) {
      let userCheck = await Order.findOne({ user: userID });

      if (userCheck) {
        let ListLocal = {};
        ListLocal.id = id;
        ListLocal.name = name;
        ListLocal.imageSrc = imageSrc;
        ListLocal.price = price;
        ListLocal.qunatity = qunatity;
        ListLocal.size = size;

        // add product
        let add = await Order.findOneAndUpdate(
          { user: userID },
          {
            $push: {
              List: ListLocal,
            },
          }
        );
        return res.status(200).json("Added");
      } else {
        let order = {};
        order.user = userID;
        order.List = {};
        order.List.id = id;
        order.List.name = name;
        order.List.imageSrc = imageSrc;
        order.List.price = price;
        order.List.qunatity = qunatity;
        order.List.size = size;

        let newOrder = new Order(order);
        await newOrder.save();

        return res.status(202).send({ message: "Added" });
      }
    }
    return res.status(304).send({ message: "Error" });
  }
);

module.exports = router;
