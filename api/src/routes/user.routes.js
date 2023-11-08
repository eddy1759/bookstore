const express = require('express');
const { verifyToken } = require('../utils/auth');
const userController = require('../controller/user.controller');

const router = express.Router();

router.post('/signup', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/verify', verifyToken, userController.verifyUserWithOtp);

router.get('/user/:id', verifyToken, userController.getUserById);
router.get('/users/all', verifyToken, userController.getAllUsers);

router.put('/user/update/:id', verifyToken, userController.updateUser);
router.delete('/user/delete/:id', verifyToken, userController.deleteUser);

module.exports = router;