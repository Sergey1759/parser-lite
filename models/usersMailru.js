const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    name: 'string',
    lastname: 'string',
    email: 'string',
    password: 'string',
    isConfirmed: { type: Boolean, default: false }
});

User = mongoose.model('User', User);

module.exports = User;
