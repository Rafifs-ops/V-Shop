const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    imageUrl: String,
    averageRating: Number
})

module.exports = mongoose.model("Product", productSchema);