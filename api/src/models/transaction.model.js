const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: Number,
    status: {
        type: String,
        enum: ['pending', 'failed', 'success'],
        default: 'pending'
    },
    currency: String,
    provider_ref: String,
    in_app_ref: String,
    provider: String,
    created_at: Date,
    updated_at: Date
})