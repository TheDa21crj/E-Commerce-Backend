const mongoose = require("mongoose");

// To add
//    1- tags - <
//    2- stocks (num of products avilable)

const ProductSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  imageSrc: {
    type: "string",
    required: true,
  },
  des: {
    type: "string",
    required: true,
  },
  rating: {
    type: "Number",
    required: true,
    default: 0,
  },
  NumReview: {
    type: "Number",
    required: true,
    default: 0,
  },
  stocks: {
    type: "Number",
    required: true,
    default: 0,
  },
  price: {
    type: "Number",
    required: true,
    default: 0,
  },
  gender: {
    type: "string",
    required: true,
  },
  tags: [
    {
      name: {
        type: "string",
        required: true,
      },
    },
  ],
  sold: {
    type: "Number",
    default: 0,
    // required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Users = mongoose.model("Product", ProductSchema);
