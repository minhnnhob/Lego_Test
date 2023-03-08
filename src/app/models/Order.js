const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    customerName: {type: String},
    email: {type: String},
    phonenumber: {type: String},
    address: {type: String},
    paymentmethod: {type: String},
    status: {type: String},
    oid: {type: Number},
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Order', Order);