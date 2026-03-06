const express = require('express');
const router = express.Router();
const { findCart, addToCart, removeFromCart, removeAllItems } = require('../controllers/orderController');

router.get('/user/:id', findCart);
router.post('/update/user/:id', addToCart);
router.delete('/delete/user/:id/product', removeFromCart);
router.delete('/deleteAll/user', removeAllItems);

module.exports = router;