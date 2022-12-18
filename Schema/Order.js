const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  List: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: {
        type: "string",
        required: true,
      },
      imageSrc: {
        type: "string",
        required: true,
      },
      price: {
        type: "Number",
        required: true,
      },
      size: {
        type: "string",
        required: true,
      },
      qunatity: {
        type: "Number",
        required: true,
      },
    },
  ],
});

module.exports = WishLists = mongoose.model("Order", OrderSchema);
