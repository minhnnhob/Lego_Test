const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Theme = new Schema({
    name: {type: String},
    description: {type: String},
    img: {type: String},
    idParent: {type: String},
})

module.exports = mongoose.model('Theme', Theme);