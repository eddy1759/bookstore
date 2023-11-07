const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: Number,
    created_at: Date,
    updated_at: Date
});

//remmove the _v from the response
orderSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.__v;
    return obj;
};

const Order = mongoose.model('Order', orderSchema);