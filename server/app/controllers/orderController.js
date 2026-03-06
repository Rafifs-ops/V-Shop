const Order = require('../models/Order')
const mongoose = require('mongoose')

exports.findCart = async (req, res) => {
    const id = String(req.params.id);

    const order = await Order.findOne({ user_id: id }).populate("cart_items.product")
    res.send(order)
}

exports.addToCart = async (req, res) => {
    const id = String(req.params.id)
    const productId = String(req.body.product_id)
    const order = await Order.findOne({ user_id: id }) || null;
    const existingItem = order ? order.cart_items.find((item => item.product.toString() === productId)) : null

    let result;
    try {
        if (order && existingItem) {
            result = await Order.updateOne(
                { user_id: id, "cart_items.product": new mongoose.Types.ObjectId(productId) },
                { $inc: { "cart_items.$.qty": 1 } },
            )
        } else {
            result = await Order.updateOne(
                { user_id: id },
                { $push: { cart_items: { product: new mongoose.Types.ObjectId(productId), qty: 1 } } },
                { upsert: true } // Jika user belum ada, maka buat dokumen baru
            )
        }
        res.send(result)
    } catch (err) {
        res.status(409).send({ message: err.message || "Some error while add to cart." })
    }
}

exports.removeFromCart = async (req, res) => {
    try {
        const id = String(req.params.id);
        const cartId = req.body.cart_id;

        // 1. Validasi awal: Cek apakah ID produk valid untuk Mongoose
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return res.status(400).send({ message: "Invalid Product ID format" });
        }

        // 2. Cari order terlebih dahulu
        const order = await Order.findOne({ user_id: id });
        if (!order) {
            return res.status(404).send({ message: "Order or Cart not found" });
        }

        // 3. Cari index item
        const itemIndex = order.cart_items.findIndex(item => item._id.toString() === cartId);

        if (itemIndex === -1) {
            return res.status(404).send({ message: "Item not found in cart" });
        }

        const targetItem = order.cart_items[itemIndex];
        let result;

        // 4. Logika Update
        if (targetItem.qty > 1) {
            // Kurangi qty saja
            result = await Order.updateOne(
                { user_id: id, "cart_items._id": new mongoose.Types.ObjectId(cartId) },
                { $inc: { "cart_items.$.qty": -1 } }
            );
        } else {
            // Hapus item dari array
            result = await Order.updateOne(
                { user_id: id },
                { $pull: { cart_items: { _id: new mongoose.Types.ObjectId(cartId) } } }
            );
        }

        res.status(200).send({
            message: "Cart updated successfully",
            result
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: err.message || "Internal Server Error while updating cart."
        });
    }
};

exports.removeAllItems = async (req, res) => {

    const userId = String(req.body.id);

    try {
        await Order.updateOne({ user_id: userId }, { $set: { cart_items: [] } });
        res.status(200).send({
            message: "Cart removed successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: err.message || "Internal Server Error while updating cart."
        });
    }
}
