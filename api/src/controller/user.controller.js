const User = require('../models/user.model');
const httpStatus = require('http-status');
const { generateAuthToken, generateOtpCode } = require('../utils/auth');
const { sentOtpCodeToUserMail } = require('../config/emailConfig');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(httpStatus.BAD_REQUEST).json({ 
                status: false,
                message: 'Required fields missing' 
            });
        }

        // Check if password is less than 8 characters
        if (password.length < 6) {
            return res.status(httpStatus.BAD_REQUEST).json({ 
                status: false,
                message: 'password error' 
            });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(httpStatus.BAD_REQUEST).json({ 
                status: false,
                message: 'User already exists, do log in' 
            });
        }

        const userBody = {
            name,
            email,
            password,
            role: req.body.role
        };

        user = new User(userBody);
        await user.save();

        return res.status(httpStatus.CREATED).json({ status: true, message: 'User created successfully' });

    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
      
        if (!email ||!password) {
            return res.status(httpStatus.BAD_REQUEST).json({ 
                status: false,
                message: 'Required fields missing' 
            });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ 
                status: false,
                message: 'User not found' 
            });
        };

        const match = await user.comparePassword(password);

        if (!match) {
            return res.status(httpStatus.UNAUTHORIZED).json({ 
                status: false,
                message: 'Invalid credentials' 
            });
        };

        const token = await generateAuthToken(user);
        const otpCode = await generateOtpCode();
        user.otp = otpCode;
        await user.save();

        await sentOtpCodeToUserMail(user, otpCode);

        return res.status(httpStatus.OK).json({
            status: true,
            message: 'Check your email to verify your account with otp code',
            token
        });
    }
    catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
};

const verifyUserWithOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ 
                status: false,
                message: 'User not found' 
            });
        };
        
        if (user.otp!== otp) {
            return res.status(httpStatus.BAD_REQUEST).json({ 
                status: false,
                message: 'Invalid otp' 
            });
        };
        // check if otp has expired and if such send another otp code
        if (Date.now() > user.otpExpires) {
            const otpCode = await generateOtpCode();
            user.otp = otpCode;
            await user.save();
            await sentOtpCodeToUserMail(user, otpCode);
            return res.status(httpStatus.BAD_REQUEST).json({ 
                status: false,
                message: 'OTP code has expired, check your email for another otp code' 
            });
        };

        if (user.otp === otp) {
            user.otp = null;
            user.otpExpires = null;
            user.isVerified = true;
            await user.save();
            return res.status(httpStatus.OK).json({ 
                status: true,
                message: 'User verified successfully' 
            });
        };
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

const getUserById = async (req, res) => {
    try {
  
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ 
                status: false,
                message: 'User not found' 
            });
        }
        return res.status(httpStatus.OK).json({ status: true, 
            data: {
            user: user
        } });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const userRole = req.user.role;

        if (userRole !== 'admin') {
            return res.status(httpStatus.UNAUTHORIZED).json({ 
                status: false,
                message: 'Unauthorized access' 
            });
        }
        const users = await User.find({});

        return res.status(httpStatus.OK).json({ status: true, 
            data: {
            users: users
        } });

    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ 
                status: false,
                message: 'User not found' 
            });
        }
        const { name, email, password } = req.body;

        const updates = {};

        if (name) updates.name = name;
        if (email) updates.email = email;
        if (password){
            if (await(user.comparePassword(password))) {
                updates.password = password;
    
            } else {
                return res.status(httpStatus.BAD_REQUEST).json({ 
                    status: false,
                    message: 'Required fields missing or password is incorrect' 
                });
            }
        }
    
        const updatedUser = await User.findByIdAndUpdate({ _id: req.params.id }, updates, { new: true });

        return res.status(httpStatus.OK).json({ status: true, 
            data: {
            user: updatedUser
        } });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userRole = req.user.role;
        if (userRole !== 'admin') {
            return res.status(401).json({ 
                status: false,
                message: 'Unauthorized access' 
            });
        }
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ 
                status: false,
                message: 'User not found' 
            });
        }
        await User.deleteOne({ _id: req.params.id });
        return res.status(204).json({ status: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    verifyUserWithOtp,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser
}
