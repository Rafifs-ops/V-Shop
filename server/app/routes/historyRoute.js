const express = require('express');
const router = express.Router();
const { findHistoryItem, addHistoryItem, removeHistoryItem } = require('../controllers/historyController');

router.get('/getHistories/:id', findHistoryItem);
router.post('/addHistory/:userId', addHistoryItem);
router.delete('/deleteHistory', removeHistoryItem);

module.exports = router;