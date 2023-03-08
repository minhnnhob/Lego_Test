const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    name: {type: String, maxLength: 255},
    email: {type: String, maxLength: 255},
    address: {type: String, maxLength: 255},
    phonenumber: {type: String, maxLength: 255},
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
})

module.exports = mongoose.model('User', User);