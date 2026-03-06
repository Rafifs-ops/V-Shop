const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    user_id: String,
    cart_items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        qty: {
            type: Number,
            default: 1
        }
    }]
})

module.exports = mongoose.model("order", orderSchema);