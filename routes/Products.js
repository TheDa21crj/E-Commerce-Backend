const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const Products = require("./../Schema/Products");

// Private || Add Products || /api/admin/Products || Admin Only
router.post(
  "/",
  [
    check("name", "name is Required").not().isEmpty(),
    check("imageSrc", "imageSrc is Required").not().isEmpty(),
    check("des", "des is Required").not().isEmpty(),
    check("rating", "rating is Required").not().isEmpty(),
    check("NumReview", "NumReview is Required").not().isEmpty(),
    check("price", "price is Required").not().isEmpty(),
    check("gender", "gender is Required").not().isEmpty(),
    check("tags", "tags is Required").not().isEmpty(),
    check("stocks", "stocks is Required").not().isEmpty(),
    check("sold", "sold is Required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      name,
      imageSrc,
      des,
      rating,
      NumReview,
      price,
      gender,
      tags,
      stocks,
      sold,
    } = req.body;

    try {
      let imgSrc = await Products.findOne({ imageSrc });

      if (imgSrc) {
        return res.status(400).json({ message: `Product Exists` });
      }
      console.log(req.body);

      let ProductSave = {};
      ProductSave.name = name;
      ProductSave.imageSrc = imageSrc;
      ProductSave.des = des;
      ProductSave.rating = rating;
      ProductSave.NumReview = NumReview;
      ProductSave.price = price;
      ProductSave.gender = gender;
      ProductSave.stocks = stocks;
      ProductSave.sold = sold;
      ProductSave.tags = {};
      ProductSave.tags.name = tags;

      let ProductData = new Products(ProductSave);

      await ProductData.save();

      res.status(200).send({ message: "Product Added" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
);

//Public || Update || /api/admin/Products/Update
router.put(
  "/Update",
  [
    check("_id", "id is Required").not().isEmpty(),
    check("field", "field is Required").not().isEmpty(),
    check("value", "value is Required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { _id, field, value } = req.body;

    try {
      let id = await Products.findOne({ _id });

      if (!id) {
        return res.status(400).json({ message: `Product Does not Exists` });
      }
      const result = await Products.updateOne(
        { _id },
        {
          $set: {
            [field]: value,
          },
        }
      );
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
);

// Private || Update Tags || /api/admin/Products/UpdateTag
router.put(
  "/UpdateTag",
  [
    check("_id", "id is Required").not().isEmpty(),
    check("name", "name is Required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { _id, name } = req.body;

    try {
      let id = await Products.findOne({ _id });

      if (!id) {
        return res.status(400).json({ message: `Product Does not Exists` });
      }

      let tag = {};
      tag.name = name;
      const result = await Products.findOneAndUpdate(
        { _id },
        {
          $push: {
            tags: tag,
          },
        }
      );
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
);

// Public || New Arrival || /api/admin/Products/NewArival
router.get("/NewArival", [], async (req, res) => {
  let data = await Products.find().sort({ date: 1 }).limit(9);
  res.status(202).json(data);
});

// Public || Top Selling || /api/admin/Products/TopSelling
router.get("/TopSelling", [], async (req, res) => {
  let data = await Products.find().sort({ sold: -1 }).limit(12);
  res.status(202).json(data);
});

// Public || Gender || /api/admin/Products/Gender
router.post(
  "/Gender",
  [check("gender", "gender is Required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { gender } = req.body;
    let data = await Products.find({ gender });
    res.status(202).json(data);
  }
);

// Public || Tag || /api/admin/Products/Tag
router.post(
  "/Tag",
  [
    check("tag", "tag is Required").not().isEmpty(),
    check("gender", "gender is Required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tag, gender } = req.body;
    let data = await Products.find({ "tags.name": tag, gender: gender });

    res.status(202).json(data);
  }
);

// Public || Tag || /api/admin/Products/MERCHANDISE
router.post(
  "/MERCHANDISE",
  [check("tag", "tag is Required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tag } = req.body;
    let data = await Products.find({ "tags.name": tag });

    res.status(202).json(data);
  }
);

// Public || Product page || /api/admin/Products/:id
router.get("/:id", async (req, res) => {
  try {
    const productD = await Products.find({ _id: req.params.id });
    if (!productD) {
      return res.status(404).json({ message: "No Product found" });
    }
    res.status(200).json(productD);
  } catch (error) {
    if (error.kind === "ObjectID") {
      return res.status(400).json({ message: "NO Product Found" });
    }
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
