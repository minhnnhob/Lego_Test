const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    username: {type: String, maxLength: 255},
    password: {type: String, maxLength: 255},
    role: {type: String, maxLength: 255},
})

module.exports = mongoose.model('Account', Account);