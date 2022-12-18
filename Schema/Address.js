const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    address: [{
        name: {
            type: "string",
            required: true,
        },
        address: {
            type: "string",
            required: true,
        },
        pinCode: {
            type: "number",
            required: true,
        },
        town: {
            type: "string",
            required: true,
        },
        state: {
            type: "string",
            required: true,
        },
        country: {
            type: "string",
            required: true,
        },
        phoneNumber: {
            type: "number",
            required: true,
        },
    }, ],
});

module.exports = WishLists = mongoose.model("Address", AddressSchema);