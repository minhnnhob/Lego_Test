const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderDetail = new Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {type: Number}
})

module.exports = mongoose.model('OrderDetail', OrderDetail);