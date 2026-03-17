const HistoryOrder = require('../models/HistoryOrder');
const mongoose = require('mongoose')

exports.findHistoryItem = async (req, res) => {
    const id = String(req.params.id);

    const history = await HistoryOrder.findOne({ user_id: id }).populate("history_items.product")

    if (!history) {
        res.json({message: 'User belum beli apapun'});
        return;
    }
    
    res.send(history)
}

exports.addHistoryItem = async (req, res) => {
    try {
        const userId = String(req.params.userId)
        const itemInCart = req.body

        // 1. Validasi input
        if (!itemInCart || !Array.isArray(itemInCart) || itemInCart.length === 0) {
            return res.status(400).send({ message: "Item di keranjang kosong." });
        }

        // 2. Mapping data agar siap di-push sekaligus
        const formattedItems = itemInCart.map(item => ({
            product: new mongoose.Types.ObjectId(item.product._id),
            qty: item.qty
        }));

        // 3. Update database sekali jalan (Lebih Cepat!)
        await HistoryOrder.updateOne(
            { user_id: userId },
            {
                $push: {
                    history_items: { $each: formattedItems } // $each untuk memasukkan semua item sekaligus dalam satu kali query.
                }
            },
            { upsert: true } // Buat dokumen baru jika belum ada
        );

        res.status(200).send({ message: "Berhasil" })
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: err.message || "Internal Server Error while updating cart."
        });
    }
}

exports.removeHistoryItem = async (req, res) => {
    try {
        const userId = String(req.body.userId);
        const historyId = req.body.historyId;

        // 1. Validasi awal: Cek apakah ID produk valid untuk Mongoose
        if (!mongoose.Types.ObjectId.isValid(historyId)) {
            return res.status(400).send({ message: "Invalid Product ID format" });
        }

        // 2. Delete History
        await HistoryOrder.updateOne(
            { user_id: userId },
            { $pull: { history_items: { _id: new mongoose.Types.ObjectId(historyId) } } }
        )

        res.status(200).send({ message: "Berhasil" })
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: err.message || "Internal Server Error while updating cart."
        });
    }
};
