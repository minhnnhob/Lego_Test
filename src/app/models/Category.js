const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema({
    name: {type: String},
    description: {type: String},
    img: {type: String},
})

module.exports = mongoose.model('Category', Category);