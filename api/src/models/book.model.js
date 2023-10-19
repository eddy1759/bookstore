const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: String,
    author: String,
    description: String,
    price: Number,
    isbn: String,
    genre: String,
    rating: Number,
    bookImageUrl: String,
    created_at: Date,
    updated_at: Date
});


//remmove the _v from the response
bookSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.__v;
    return obj;
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
