const Account = require('../models/Account');
const User = require('../models/User');
const category = require('../models/Category');

const {convertToObject} = require('../../util/mongoose');
const {convertToArrayObjects} = require('../../util/mongoose');
const Category = require('../models/Category');
var url = 'mongodb+srv://lego:lego@cluster0.3no8d6y.mongodb.net/test';
var MongoClient = require('mongodb').MongoClient;

class AdminCategory {
    //[GET] /news
    async index(req, res) {
        const categories = await category.find();
        res.render("category/main", {admin: true, categories: convertToArrayObjects(categories)})
    }
    category(req, res){
        res.render('category/add', {admin:true});
    }
    addCategory(req, res){
        const name = req.body.txtName
        const description = req.body.txtDescription
        const img = req.body.img
        const cat = new category();
        cat.name = name;
        cat.description = description;
        cat.img = img;
        cat.save().then(res.redirect('/admin/category'));

    }

    viewCategory(req, res) {

        Category.findOne({_id: req.params.id})
        .then(cat=>{
            res.render('category/edit', {admin: true, category: convertToObject(cat)})
        }).catch(err=>console.log(err));
    }

    editCategory(req, res){
        Category.updateOne({_id: req.body._id}, {
            name: req.body.name,
            description: req.body.description,
            img: req.body.img
        }).then(()=>{
            res.redirect('/admin/category');
        }).catch(err=>console.log(err));
    }

    deleteCategory(req, res){
        Category.deleteOne({_id: req.params.id})
        .then(()=>res.redirect('/admin/category/'))
        .catch(err=>console.log(err));
    }

}

//make object NewsController to use in another file
module.exports = new AdminCategory();