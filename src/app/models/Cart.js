const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cart = new Schema({
    quantity: {type: Number},
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Cart', Cart);