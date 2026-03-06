const mongoose = require("mongoose");

const historySchema = mongoose.Schema({
    user_id: String,
    history_items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        qty: {
            type: Number,
            default: 1
        },
        date: {
            type: Date,
            default: Date.now,
            required: true
        }
    }]
})

module.exports = mongoose.model("history", historySchema);