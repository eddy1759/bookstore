const express = require('express');
const { verifyToken } = require('../utils/auth');
const bookController = require('../controller/book.controller');

const router = express.Router();

router.post('/', verifyToken, bookController.createBook);
router.get('/', verifyToken, bookController.getAllBooks);
router.get('/:id', verifyToken, bookController.getBookById);
router.put('/:id', verifyToken, bookController.updateBook);
router.delete('/:id', verifyToken, bookController.deleteBook);

module.exports = router;