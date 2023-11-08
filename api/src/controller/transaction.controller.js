const config = require('../config/config');
const Tx = require('../models/transaction.model');
const Order = require('../models/order.model');

const initTxPayload = {
    amount: Number,
    currency: String,
    tx_ref: String,
    orderId: String,
    redirect_url: String,
    payment_method: String
}

const initiateTransaction = async (req, res) => {
    try {
        payload =  initTxPayload,
        method = 'flutterwave' | 'paystack',
        if (method === 'flutterwave') {
            const res = await fetch('https://api.flutterwave.com/v3/payments', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${config.FLUTTERWAVE_API_KEY}`,
                }
            })
        }

    } catch (error) {
        
    }
}