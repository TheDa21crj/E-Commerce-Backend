const mongoose = require("mongoose");

const WishListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    Product: [{
        id: {
            type: "string",
            required: true,
        },
        name: {
            type: "string",
            required: true,
        },
        imgSrc: {
            type: "string",
            required: true,
        },
        price: {
            type: "number",
            required: true,
        },
    }, ],
});

module.exports = WishLists = mongoose.model("WishList", WishListSchema);