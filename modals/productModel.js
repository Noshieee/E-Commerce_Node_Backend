const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: {
        type: String,
        required: true,
        default: null,
    },
    descripton: {
        type: String,
        required: true,
        default: 'Soccer Tingz'
    },
    creator: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Product", productSchema);