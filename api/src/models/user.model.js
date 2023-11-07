const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        unique: true,
        required: true 
    },
    password: {
        type: String,
        required: true 
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now 
    },
    updated_at: {
        type: Date,
        default: Date.now 
    }
});


// Hash the password before saving the user model
userSchema.pre('save', async function (next) {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

// A helper method for comparing user's password
userSchema.methods.comparePassword = async function (candidatePassword) {
    const user = this;
    const match = await bcrypt.compare(candidatePassword, user.password);
    return match;
};

//remove _v, password from the response
userSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
}

const User = mongoose.model('User', userSchema);

module.exports = User;