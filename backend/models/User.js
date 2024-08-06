// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true }
// });

// module.exports = mongoose.model('User', userSchema);
// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Method to compare password
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// Hash the password before saving
userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
