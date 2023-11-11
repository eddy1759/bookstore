const express = require('express');
const { verifyToken } = require('../utils/auth');
const txnController = require('../controller/transaction.controller');

const router = express.Router();

router.post('/confirm', verifyToken, txnController.confirmFlwTransaction);

router.get(
    '/users', verifyToken, txnController.getAllTransactions
)

router.get('/:txnId', verifyToken, txnController.getTransactionById);

router.post('/webhook', txnController.confirmFlwTxWebHook);

module.exports = router;