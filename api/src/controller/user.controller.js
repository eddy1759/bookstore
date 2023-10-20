const User = require('../models/user.model');
const { generateAuthToken } = require('../utils/auth');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ 
                status: false,
                message: 'Required fields missing' 
            });
        }

        // Check if password is less than 8 characters
        if (password.length < 6) {
            return res.status(400).json({ 
                status: false,
                message: 'password error' 
            });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ 
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

        return res.status(201).json({ status: true, message: 'User created successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({
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
            return res.status(400).json({ 
                status: false,
                message: 'Required fields missing' 
            });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ 
                status: false,
                message: 'User not found' 
            });
        };

        const match = await user.comparePassword(password);

        if (!match) {
            return res.status(401).json({ 
                status: false,
                message: 'Invalid credentials' 
            });
        };

        const token = await generateAuthToken(user);
        
        return res.status(200).json({
            status: true,
            message: 'User logged in successfully',
            token
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
};

const getUserById = async (req, res) => {
    try {
  
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ 
                status: false,
                message: 'User not found' 
            });
        }
        return res.status(200).json({ status: true, 
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
            return res.status(401).json({ 
                status: false,
                message: 'Unauthorized access' 
            });
        }
        const users = await User.find({});

        return res.status(200).json({ status: true, 
            data: {
            users: users
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

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ 
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
                return res.status(400).json({ 
                    status: false,
                    message: 'Required fields missing or password is incorrect' 
                });
            }
        }
    
        const updatedUser = await User.findByIdAndUpdate({ _id: req.params.id }, updates, { new: true });

        return res.status(200).json({ status: true, 
            data: {
            user: updatedUser
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
            return res.status(404).json({ 
                status: false,
                message: 'User not found' 
            });
        }
        await User.deleteOne({ _id: req.params.id });
        return res.status(204).json({ status: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser
}
