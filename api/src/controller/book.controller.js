const Book = require('../models/book.model');

const createBook = async (req, res) => {
    try {

        const userRole = req.user.role;
        if (userRole !== 'admin') {
            return res.status(401).json({
                status: false,
                message: 'Unauthorized access'
            });
        }
        
        const { title, author, description, price, isbn } = req.body;
        
        if (!title || !author || !description || !price || !isbn) {
            return res.status(400).json({ 
                status: false,
                message: 'Required fields missing' 
            });
        }

        const bookBody = {
            title,
            author,
            description,
            price,
            isbn
        };

        const book = new Book(bookBody);
        await book.save();

        return res.status(201).json({ 
            status: true, 
            message: 'Book created successfully' 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        return res.status(200).json({ 
            status: true, 
            message: 'Books fetched successfully',
            books 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ 
                status: false,
                message: 'Book not found' 
            });
        }
        return res.status(200).json({ 
            status: true, 
            book 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}


const updateBook = async (req, res) => {
    try {

        const userRole = req.user.role;
        if (userRole !== 'admin') {
            return res.status(401).json({
                status: false,
                message: 'Unauthorized access'
            });
        }

        const { title, author, description, price, isbn} = req.body;

        const updates = {};

        if (title) updates.title = title;
        if (author) updates.author = author;
        if (description) updates.description = description;
        if (price) updates.price = price;
        if (isbn) updates.isbn = isbn;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Required fields missing'
            });
        }

        const updateBook = await Book.findByIdAndUpdate(req.params.id, updates, { new: true });

       if (!updateBook) {
            return res.status(404).json({ 
                status: false,
                message: 'Book not found' 
            });
        }

        return res.status(200).json({ status: true, message: 'Book updated successfully', data: updateBook });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

const deleteBook = async (req, res) => {
    try {

        const userRole = req.user.role;
        if (userRole !== 'admin') {
            return res.status(401).json({
                status: false,
                message: 'Unauthorized access'
            });
        }
        
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ 
                status: false,
                message: 'Book not found' 
            });
        }
        return res.status(200).json({ status: true, message: 'Book deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
}


module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
}