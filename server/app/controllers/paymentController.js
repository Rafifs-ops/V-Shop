const Midtrans = require('midtrans-client');

// --- Inisialisasi Midtrans Snap ---
const snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

exports.payment = async (req, res) => {
    try {
        // Mendapatkan data yang dikirim dari frontend (client)
        const { username, email, totalPrice, qty } = req.body;

        // Jika user dan email tidak ada, maka hentikan program
        if (!username || !email) {
            return res.status(400).json({ error: "Username and email are required" });
        }

        const orderId = `V-SHOP-${Date.now()}`;

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: totalPrice,
            },
            customer_details: {
                name: username,
                email: email
            },
        };

        const transaction = await snap.createTransaction(parameter);

        res.status(200).json({ token: transaction.token, order_id: orderId });

    } catch (error) {
        console.error("Error creating Midtrans transaction:", error.message);
        res.status(500).json({ error: error.message });
    }
}