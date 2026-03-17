require('dotenv').config();
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const mongoose = require('mongoose')

let corsOptions = { origin: "http://localhost:5173" } // enable cors
app.use(cors(corsOptions)) // parse request of content-type - application/json
app.use(express.json()) // parse content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
app.use('/img', express.static(path.join(__dirname, './public/img'))) // path for image

// Connect Database
mongoose.connect(process.env.MONGO_URI).then(() => { console.log('Database connected!') }).catch((err) => {
    console.log("Cannot connect to the database!", err)
    process.exit()
})

// Import Routes
const orderRoutes = require('./app/routes/orderRoute');
const productRoutes = require('./app/routes/productRoute');
const authRoutes = require("./app/routes/authRoute");
const payRoutes = require('./app/routes/paymentRoute');
const historyRoutes = require('./app/routes/historyRoute');

// Endpoint API
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', payRoutes);
app.use('/api/history', historyRoutes);


const PORT = 8080
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})