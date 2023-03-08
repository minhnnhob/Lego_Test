const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Product = new Schema({
    name: {type: String, maxLength: 255},
    age: {type: Number},
    price: {type: Number},
    quantity: {type: Number},
    slug: {type: String, slug: 'name', unique: true},
    img1: {type: String, maxLength: 255},
    img2: {type: String, maxLength: 255},
    img3: {type: String, maxLength: 255},
    description: {type: String, maxLength: 255},
    status: {type: String},
    ratting: {type: Number},
    theme:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theme'
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
})

module.exports = mongoose.model('Product', Product);