const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const Shoping = require("./../Schema/Shoping");
const UserAuth = require("./../middleware/UserAuth");
const Product = require("./../Schema/Products");

// Private || See Shoping || api/Shoping
router.get("/", UserAuth, async (req, res) => {
  let userID = req.userId;
  try {
    let userCheck = await Shoping.findOne({ user: userID });
    if (userCheck) {
      return res.status(200).json({ message: userCheck.List });
    } else {
      return res.status(200).json({ message: "zero" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

// Private || Add Shoping || api/Shoping/add
router.post(
  "/add",
  [
    UserAuth,
    check("id", "id is Required").not().isEmpty(),
    check("name", "name is Required").not().isEmpty(),
    check("imgSrc", "imgSrc is Required").not().isEmpty(),
    check("price", "price is Required").not().isEmpty(),
    check("qunatity", "qunatity is Required").not().isEmpty(),
    check("size", "size is Required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, name, imgSrc, price, qunatity, size } = req.body;
    let userID = req.userId;

    let userCheck = await Shoping.findOne({ user: userID });

    if (userCheck) {
      let List = {};
      List.id = id;
      List.name = name;
      List.imageSrc = imgSrc;
      List.price = price;
      List.qunatity = qunatity;
      List.size = size;

      for (let i = 0; i < userCheck.List.length; i++) {
        if (userCheck.List[i].id === id) {
          return res.status(400).json({ message: "same" });
        }
      }

      // add product
      let add = await Shoping.findOneAndUpdate(
        { user: userID },
        {
          $push: {
            List: List,
          },
        }
      );
      return res.status(200).json("Added to Shopping Cart");
    } else {
      let Shop = {};
      Shop.user = userID;
      Shop.List = {};
      Shop.List.id = id;
      Shop.List.name = name;
      Shop.List.imageSrc = imgSrc;
      Shop.List.price = price;
      Shop.List.qunatity = qunatity;
      Shop.List.size = size;

      let newShop = new Shoping(Shop);
      await newShop.save();
      return res.status(200).json("Added to Shopping Cart");
    }
  }
);

// Private || Delete Shoping Product || api/Shoping/delete/product
router.delete(
  "/delete/product",
  [UserAuth, check("id", "id is Required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.body;
    let userID = req.userId;

    let userCheck = await Shoping.updateOne(
      { user: userID },
      { $pull: { List: { id: id } } }
    );

    res.status(202).json(userCheck);
  }
);

// Private || Delete Shoping (All) || api/Shoping/delete/product/all
router.delete("/delete/product/all", UserAuth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let userID = req.userId;

  let dataDelete = await Shoping.find({ user: userID });

  let userCheck = await Shoping.deleteMany({ user: userID });

  res.status(202).json(dataDelete);
});

module.exports = router;
